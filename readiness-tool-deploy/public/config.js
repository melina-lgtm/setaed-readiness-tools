// =============================================================================
// PRISM — public Supabase client configuration
//
// These are PUBLIC keys, safe to expose in client-side code:
//   - SUPABASE_URL: your project's public API endpoint
//   - SUPABASE_ANON_KEY: rate-limited public key, scoped by row-level security
//
// The service_role key (server-only, bypasses RLS) is NEVER here — it lives in
// Vercel environment variables and is only read by api/analyze.js on the server.
//
// If keys ever rotate, only this file needs to change.
// =============================================================================

window.PRISM_SUPABASE = {
  url: 'https://adnowsnxxbxrezfdlmce.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbm93c254eGJ4cmV6ZmRsbWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzQ3MDMsImV4cCI6MjA5NTQxMDcwM30.OQdBhFGFuFSDSL_nchGxOuHptHu6m33v-vP3WIwVi9E'
};
