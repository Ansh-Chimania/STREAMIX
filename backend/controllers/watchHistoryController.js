const { supabaseAdmin } = require('../config/supabase');

exports.getWatchHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('watch_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (countError) throw countError;

    // Get paginated results
    const { data: history, error } = await supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('watched_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    // Map to frontend format
    const mapped = history.map(h => ({
      _id: h.id,
      user: h.user_id,
      tmdbId: h.tmdb_id,
      title: h.title,
      posterPath: h.poster_path,
      backdropPath: h.backdrop_path,
      rating: h.rating,
      releaseDate: h.release_date,
      mediaType: h.media_type,
      overview: h.overview,
      watchedAt: h.watched_at,
      watchType: h.watch_type,
      createdAt: h.created_at
    }));

    res.json({
      success: true,
      history: mapped,
      page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
      total_results: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const { tmdbId, title, posterPath, backdropPath, rating, releaseDate, mediaType, overview, watchType } = req.body;

    // Check if entry exists (upsert-like behavior)
    const { data: existing } = await supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', tmdbId)
      .eq('watch_type', watchType || 'page_view')
      .maybeSingle();

    if (existing) {
      // Update the watched_at timestamp
      const { data: updated, error } = await supabaseAdmin
        .from('watch_history')
        .update({ watched_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        history: {
          _id: updated.id,
          user: updated.user_id,
          tmdbId: updated.tmdb_id,
          title: updated.title,
          posterPath: updated.poster_path,
          backdropPath: updated.backdrop_path,
          rating: updated.rating,
          releaseDate: updated.release_date,
          mediaType: updated.media_type,
          overview: updated.overview,
          watchedAt: updated.watched_at,
          watchType: updated.watch_type,
          createdAt: updated.created_at
        }
      });
    }

    // Create new entry
    const { data: historyEntry, error } = await supabaseAdmin
      .from('watch_history')
      .insert({
        user_id: req.user.id,
        tmdb_id: tmdbId,
        title,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        rating,
        release_date: releaseDate,
        media_type: mediaType,
        overview,
        watch_type: watchType || 'page_view'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      history: {
        _id: historyEntry.id,
        user: historyEntry.user_id,
        tmdbId: historyEntry.tmdb_id,
        title: historyEntry.title,
        posterPath: historyEntry.poster_path,
        backdropPath: historyEntry.backdrop_path,
        rating: historyEntry.rating,
        releaseDate: historyEntry.release_date,
        mediaType: historyEntry.media_type,
        overview: historyEntry.overview,
        watchedAt: historyEntry.watched_at,
        watchType: historyEntry.watch_type,
        createdAt: historyEntry.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('watch_history')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
