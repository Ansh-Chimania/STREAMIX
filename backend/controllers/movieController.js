const { supabaseAdmin } = require('../config/supabase');

exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('movies')
      .select('*, profiles!movies_added_by_fkey(name)', { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: movies, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    // Map to frontend format
    const mapped = movies.map(m => ({
      _id: m.id,
      title: m.title,
      tmdbId: m.tmdb_id,
      posterPath: m.poster_path,
      backdropPath: m.backdrop_path,
      description: m.description,
      releaseDate: m.release_date,
      rating: m.rating,
      voteCount: m.vote_count,
      genres: m.genres,
      category: m.category,
      trailerKey: m.trailer_key,
      trailerUrl: m.trailer_url,
      runtime: m.runtime,
      language: m.language,
      popularity: m.popularity,
      isCustom: m.is_custom,
      addedBy: m.profiles ? { name: m.profiles.name } : null,
      createdAt: m.created_at,
      updatedAt: m.updated_at
    }));

    res.json({
      success: true,
      results: mapped,
      page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
      total_results: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const { data: movie, error } = await supabaseAdmin
      .from('movies')
      .select('*, profiles!movies_added_by_fkey(name)')
      .eq('id', req.params.id)
      .single();

    if (error || !movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      success: true,
      movie: {
        _id: movie.id,
        title: movie.title,
        tmdbId: movie.tmdb_id,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        description: movie.description,
        releaseDate: movie.release_date,
        rating: movie.rating,
        voteCount: movie.vote_count,
        genres: movie.genres,
        category: movie.category,
        trailerKey: movie.trailer_key,
        trailerUrl: movie.trailer_url,
        runtime: movie.runtime,
        language: movie.language,
        popularity: movie.popularity,
        isCustom: movie.is_custom,
        addedBy: movie.profiles ? { name: movie.profiles.name } : null,
        createdAt: movie.created_at,
        updatedAt: movie.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const {
      title, tmdbId, posterPath, backdropPath, description,
      releaseDate, rating, voteCount, genres, category,
      trailerKey, trailerUrl, runtime, language, popularity
    } = req.body;

    const { data: movie, error } = await supabaseAdmin
      .from('movies')
      .insert({
        title,
        tmdb_id: tmdbId,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        description,
        release_date: releaseDate,
        rating,
        vote_count: voteCount,
        genres,
        category,
        trailer_key: trailerKey,
        trailer_url: trailerUrl,
        runtime,
        language,
        popularity,
        is_custom: true,
        added_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      movie: {
        _id: movie.id,
        title: movie.title,
        tmdbId: movie.tmdb_id,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        description: movie.description,
        releaseDate: movie.release_date,
        rating: movie.rating,
        voteCount: movie.vote_count,
        genres: movie.genres,
        category: movie.category,
        trailerKey: movie.trailer_key,
        trailerUrl: movie.trailer_url,
        runtime: movie.runtime,
        language: movie.language,
        popularity: movie.popularity,
        isCustom: movie.is_custom,
        addedBy: req.user.id,
        createdAt: movie.created_at,
        updatedAt: movie.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const updates = {};
    const fieldMap = {
      title: 'title', tmdbId: 'tmdb_id', posterPath: 'poster_path',
      backdropPath: 'backdrop_path', description: 'description',
      releaseDate: 'release_date', rating: 'rating', voteCount: 'vote_count',
      genres: 'genres', category: 'category', trailerKey: 'trailer_key',
      trailerUrl: 'trailer_url', runtime: 'runtime', language: 'language',
      popularity: 'popularity'
    };

    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) {
        updates[snake] = req.body[camel];
      }
    }
    updates.updated_at = new Date().toISOString();

    const { data: movie, error } = await supabaseAdmin
      .from('movies')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      success: true,
      movie: {
        _id: movie.id,
        title: movie.title,
        tmdbId: movie.tmdb_id,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        description: movie.description,
        releaseDate: movie.release_date,
        rating: movie.rating,
        voteCount: movie.vote_count,
        genres: movie.genres,
        category: movie.category,
        trailerKey: movie.trailer_key,
        trailerUrl: movie.trailer_url,
        runtime: movie.runtime,
        language: movie.language,
        popularity: movie.popularity,
        isCustom: movie.is_custom,
        createdAt: movie.created_at,
        updatedAt: movie.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { data: movie, error } = await supabaseAdmin
      .from('movies')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
