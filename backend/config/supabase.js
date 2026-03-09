const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Admin client (bypasses RLS) - for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Public client (respects RLS) - for user-scoped operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a Supabase client scoped to a specific user's JWT.
 * This client will respect RLS policies for that user.
 */
const createUserClient = (accessToken) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};

module.exports = { supabase, supabaseAdmin, createUserClient };
