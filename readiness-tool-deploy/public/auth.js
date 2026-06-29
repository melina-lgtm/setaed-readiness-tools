// =============================================================================
// PRISM — shared authentication client
//
// Wraps the Supabase JS SDK so other pages don't have to import it directly.
// Exposes a single global: window.PRISM_AUTH
//
// Loaded by: signin.html, diligence-rubric.html
// Depends on:
//   - window.supabase (from @supabase/supabase-js CDN script tag)
//   - window.PRISM_SUPABASE (from config.js)
// =============================================================================

(function () {
  if (!window.supabase || !window.PRISM_SUPABASE) {
    console.error('[PRISM_AUTH] Missing dependencies. Load supabase-js and config.js before auth.js.');
    return;
  }

  const { createClient } = window.supabase;
  const sb = createClient(window.PRISM_SUPABASE.url, window.PRISM_SUPABASE.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  });

  window.PRISM_AUTH = {
    // The underlying Supabase client, for direct DB queries
    client: sb,

    // Return the current user, or null if signed out
    async getUser() {
      const { data } = await sb.auth.getUser();
      return data && data.user ? data.user : null;
    },

    // Return the current session (includes access_token for /api/analyze)
    async getSession() {
      const { data } = await sb.auth.getSession();
      return data && data.session ? data.session : null;
    },

    // Send a magic-link email. Returns { data, error }.
    async signInWithEmail(email, redirectTo) {
      return sb.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: redirectTo || (window.location.origin + '/diligence-rubric.html')
        }
      });
    },

    // Sign the user out.
    async signOut() {
      return sb.auth.signOut();
    },

    // Subscribe to auth state changes. Callback receives (event, session).
    // event is one of: 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED'
    onAuthChange(cb) {
      return sb.auth.onAuthStateChange(cb);
    }
  };
})();
