const { supabaseAdmin } = require('../config/supabase');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts in parallel
    const [usersResult, moviesResult, favoritesResult, bannedResult] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('movies').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('favorites').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true)
    ]);

    // Get recent users
    const { data: recentUsersRaw } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentUsers = (recentUsersRaw || []).map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      is_banned: u.is_banned,
      createdAt: u.created_at
    }));

    res.json({
      success: true,
      stats: {
        totalUsers: usersResult.count || 0,
        totalMovies: moviesResult.count || 0,
        totalFavorites: favoritesResult.count || 0,
        bannedUsers: bannedResult.count || 0,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    const mapped = (users || []).map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      isBanned: u.is_banned,
      createdAt: u.created_at
    }));

    res.json({
      success: true,
      users: mapped,
      page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
      total_results: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    // Fetch the user profile
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (profile.role === 'admin') {
      return res.status(400).json({ error: 'Cannot ban admin' });
    }

    const newBanStatus = !profile.is_banned;

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ is_banned: newBanStatus, updated_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: newBanStatus ? 'User banned' : 'User unbanned',
      user: { id: profile.id, name: profile.name, isBanned: newBanStatus }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (profile.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin' });
    }

    // Delete related data first
    await supabaseAdmin.from('favorites').delete().eq('user_id', req.params.id);
    await supabaseAdmin.from('watch_history').delete().eq('user_id', req.params.id);

    // Delete profile
    await supabaseAdmin.from('profiles').delete().eq('id', req.params.id);

    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(req.params.id);

    res.json({ success: true, message: 'User and related data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
