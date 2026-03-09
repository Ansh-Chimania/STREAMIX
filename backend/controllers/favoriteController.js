const { supabaseAdmin } = require('../config/supabase');

exports.getFavorites = async (req, res) => {
  try {
    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to match the frontend expected format
    const mapped = favorites.map(f => ({
      _id: f.id,
      user: f.user_id,
      tmdbId: f.tmdb_id,
      title: f.title,
      posterPath: f.poster_path,
      backdropPath: f.backdrop_path,
      rating: f.rating,
      releaseDate: f.release_date,
      mediaType: f.media_type,
      overview: f.overview,
      createdAt: f.created_at
    }));

    res.json({ success: true, favorites: mapped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { tmdbId, title, posterPath, backdropPath, rating, releaseDate, mediaType, overview } = req.body;

    // Check if already favorited
    const { data: existing } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', tmdbId)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    const { data: favorite, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: req.user.id,
        tmdb_id: tmdbId,
        title,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        rating,
        release_date: releaseDate,
        media_type: mediaType,
        overview
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      favorite: {
        _id: favorite.id,
        user: favorite.user_id,
        tmdbId: favorite.tmdb_id,
        title: favorite.title,
        posterPath: favorite.poster_path,
        backdropPath: favorite.backdrop_path,
        rating: favorite.rating,
        releaseDate: favorite.release_date,
        mediaType: favorite.media_type,
        overview: favorite.overview,
        createdAt: favorite.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('tmdb_id', parseInt(tmdbId));

    if (error) throw error;

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const { data: favorite } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', parseInt(tmdbId))
      .maybeSingle();

    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
