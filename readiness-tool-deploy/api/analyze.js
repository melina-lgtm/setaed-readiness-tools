// Vercel/Node serverless function that proxies PRISM Analysis to Anthropic's API.
// PART B (prompt-boundary) + PART A (hardening) combined — 2026-07-03.
// Drop-in replacement for readiness-tool-deploy/api/analyze.js.
//
// The prompt is now built SERVER-SIDE from proposal text. The client no longer sends a
// free-form prompt, so the endpoint can no longer be repurposed as a general Claude proxy.
//
// Contract:
//   POST { proposalText: string, pass: "scoring" | "risk", ventureName?: string }
//   Legacy { prompt } requests are rejected with 400 so nothing silently keeps working.
//
// Also includes Part A hardening: origin-locked CORS, per-caller daily rate limiting via
// the daily-salted ip_hash in audit_log, generic client errors, defensive body parsing.
//
// Required env vars:
//   ANTHROPIC_API_KEY
//   SUPABASE_SERVICE_ROLE_KEY      (audit writes AND rate-limit reads)
// Optional:
//   ANTHROPIC_MODEL               (default claude-haiku-4-5-20251001)
//   ALLOWED_ORIGINS               (comma-separated; default is the prod Vercel origin)
//   ANON_DAILY_LIMIT              (default 20)
//   USER_DAILY_LIMIT             (default 200)
//
// DB prerequisites: see PRISM_api_hardening_notes.md (created_at column + indexes + prune).

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';
import { buildPrompt } from './_prism-prompts.js';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 8000;
const ANON_DAILY_LIMIT = parseInt(process.env.ANON_DAILY_LIMIT || '20', 10);
const USER_DAILY_LIMIT = parseInt(process.env.USER_DAILY_LIMIT || '200', 10);
const VALID_PASSES = new Set(['scoring', 'risk']);
const MIN_PROPOSAL_CHARS = 200;
const MAX_PROPOSAL_CHARS = 250000;

// Public — safe to embed. Must match public/config.js.
const SUPABASE_URL = 'https://adnowsnxxbxrezfdlmce.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbm93c254eGJ4cmV6ZmRsbWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzQ3MDMsImV4cCI6MjA5NTQxMDcwM30.OQdBhFGFuFSDSL_nchGxOuHptHu6m33v-vP3WIwVi9E';

const DEFAULT_ORIGINS = ['https://setaed-readiness-tools.vercel.app'];

function allowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ORIGINS;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const list = allowedOrigins();
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', (origin && list.includes(origin)) ? origin : list[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function hashIp(req) {
  const ip = getClientIp(req);
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(ip + ':' + day).digest('hex').slice(0, 32);
}

async function verifyUserToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const resp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { 'Authorization': 'Bearer ' + token, 'apikey': SUPABASE_ANON_KEY },
    });
    if (!resp.ok) return null;
    const user = await resp.json();
    return user && user.id ? user : null;
  } catch (e) {
    return null;
  }
}

async function countTodaysCalls({ ipHash, userId }) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  let filter;
  if (userId) {
    const midnight = new Date().toISOString().slice(0, 10) + 'T00:00:00Z';
    filter = `user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${encodeURIComponent(midnight)}`;
  } else {
    filter = `ip_hash=eq.${encodeURIComponent(ipHash)}`;
  }
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/audit_log?select=id&${filter}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'count=exact',
        'Range': '0-0',
      },
    });
    const cr = resp.headers.get('content-range') || '';
    const total = cr.includes('/') ? parseInt(cr.split('/')[1], 10) : NaN;
    return Number.isFinite(total) ? total : null;
  } catch (e) {
    console.warn('rate-limit count failed:', e && e.message);
    return null;
  }
}

function writeAuditRow(userId, action, ipHash) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  fetch(SUPABASE_URL + '/rest/v1/audit_log', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ user_id: userId, action, ip_hash: ipHash }),
  }).catch(() => { /* best effort */ });
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Auth: a token, if present, must be valid. No token means anonymous (allowed).
  let userId = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    const user = await verifyUserToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired sign-in token. Please sign in again.' });
    }
    userId = user.id;
  }

  // Defensive body parse.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }
  body = body || {};

  // Reject the legacy free-form contract loudly.
  if ('prompt' in body) {
    return res.status(400).json({ error: 'This endpoint no longer accepts a raw "prompt". Send { proposalText, pass }.' });
  }

  const { proposalText, pass } = body;
  if (!VALID_PASSES.has(pass)) {
    return res.status(400).json({ error: 'Invalid or missing "pass" (expected "scoring" or "risk").' });
  }
  if (typeof proposalText !== 'string' || proposalText.trim().length < MIN_PROPOSAL_CHARS) {
    return res.status(400).json({ error: `"proposalText" must be a string of at least ${MIN_PROPOSAL_CHARS} characters.` });
  }
  if (proposalText.length > MAX_PROPOSAL_CHARS) {
    return res.status(413).json({ error: 'Proposal text too large.' });
  }

  // Rate limit. Fails open if the count can't be read.
  const ipHash = hashIp(req);
  const limit = userId ? USER_DAILY_LIMIT : ANON_DAILY_LIMIT;
  const used = await countTodaysCalls({ ipHash, userId });
  if (used !== null && used >= limit) {
    res.setHeader('Retry-After', '3600');
    return res.status(429).json({
      error: userId
        ? 'Daily analysis limit reached. Please try again tomorrow.'
        : 'Daily analysis limit reached. Sign in for a higher limit, or try again tomorrow.',
    });
  }

  // Build the prompt server-side from the trusted templates.
  let prompt;
  try {
    prompt = buildPrompt(pass, proposalText);
  } catch (e) {
    console.error('buildPrompt failed:', e);
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  writeAuditRow(userId, 'analyze_call', ipHash);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (response.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');

    return res.status(200).json({ text, model: response.model, usage: response.usage });
  } catch (err) {
    console.error('Anthropic API error:', err);
    return res.status(502).json({ error: 'The analysis service is temporarily unavailable. Please try again.' });
  }
}
