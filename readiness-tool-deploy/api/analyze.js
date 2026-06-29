// Vercel/Node serverless function that proxies PRISM Analysis to Anthropic's API.
//
// Required env vars on the host:
//   ANTHROPIC_API_KEY            — your Anthropic API key
//   SUPABASE_SERVICE_ROLE_KEY    — server-only, NEVER expose to browser
// Optional:
//   ANTHROPIC_MODEL              — defaults to claude-haiku-4-5-20251001
//
// Behavior:
//   - If a Bearer token is provided, validate it with Supabase and attribute the call.
//   - If no Bearer token, allow as anonymous (preserves the public lead-magnet path).
//   - Either way, write a best-effort audit_log row.

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 8000;

// Supabase project URL and anon key are public — safe to embed here.
// They MUST match what public/config.js uses on the client.
const SUPABASE_URL = 'https://adnowsnxxbxrezfdlmce.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbm93c254eGJ4cmV6ZmRsbWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzQ3MDMsImV4cCI6MjA5NTQxMDcwM30.OQdBhFGFuFSDSL_nchGxOuHptHu6m33v-vP3WIwVi9E';

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

// One-way hash with daily salt rotation. Lets us correlate abuse within a day
// without ever storing raw IPs.
function hashIp(req) {
  const ip = getClientIp(req);
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(ip + ':' + day).digest('hex').slice(0, 32);
}

// Validate a Supabase user token. Returns the user object or null.
async function verifyUserToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const resp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    if (!resp.ok) return null;
    const user = await resp.json();
    return user && user.id ? user : null;
  } catch (e) {
    return null;
  }
}

// Best-effort audit row insert. Uses service_role to bypass RLS.
// Errors are swallowed — audit logging must never block or break the user request.
function writeAuditRow(userId, action, ipHash) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  // Fire-and-forget; don't await
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
  // CORS — now allows Authorization header for signed-in users
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'Server is missing ANTHROPIC_API_KEY environment variable.',
    });
  }

  // Auth check: if a token is provided, it must be valid.
  // If no token, treat as anonymous (allowed).
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

  const body = req.body || {};
  const prompt = typeof body === 'string' ? JSON.parse(body).prompt : body.prompt;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
  }
  if (prompt.length > 250000) {
    return res.status(413).json({ error: 'Prompt too large.' });
  }

  // Audit: fire-and-forget so it never blocks the response
  writeAuditRow(userId, 'analyze_call', hashIp(req));

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
    return res.status(500).json({
      error: err.message || 'Unknown error from analysis backend.',
    });
  }
}
