const { supabaseAdmin } = require('../config/supabase');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // Verify the Supabase JWT and get user info
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Not authorized, token invalid' });
    }

    // Fetch the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    if (profile.is_banned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
      avatar: profile.avatar,
      preferences: profile.preferences,
      is_banned: profile.is_banned,
      created_at: profile.created_at
    };

    // Store the access token for creating user-scoped clients
    req.accessToken = token;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };
