// Vercel/Node serverless function that proxies the R&D Readiness Analysis
// to Anthropic's API. Keeps the API key on the server side.
//
// Required env var on the host: ANTHROPIC_API_KEY
// Optional: ANTHROPIC_MODEL (defaults to claude-haiku-4-5-20251001)

import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 8000;

export default async function handler(req, res) {
  // CORS for safety in case the artifact is embedded elsewhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'Server is missing ANTHROPIC_API_KEY environment variable.',
    });
  }

  const body = req.body || {};
  const prompt = typeof body === 'string' ? JSON.parse(body).prompt : body.prompt;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
  }
  if (prompt.length > 250000) {
    return res.status(413).json({ error: 'Prompt too large.' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    // Concatenate all text blocks in the response
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
