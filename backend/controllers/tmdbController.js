const axios = require('axios');

const TMDB_BASE = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdbFetch = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE}${endpoint}`, {
      params: { api_key: API_KEY, ...params }
    });
    return response.data;
  } catch (error) {
    console.error(`[TMDB Proxy Error] ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { time_window = 'week', page = 1 } = req.query;
    const data = await tmdbFetch(`/trending/all/${time_window}`, { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/popular', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/top_rated', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
};

exports.getUpcomingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/upcoming', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};

exports.getNowPlayingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/now_playing', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
};

exports.getPopularTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/tv/popular', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular TV shows' });
  }
};

exports.getTopRatedTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/tv/top_rated', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top rated TV' });
  }
};

exports.getAiringTodayTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/tv/airing_today', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airing today' });
  }
};

exports.getMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbFetch(`/movie/${id}`, {
      append_to_response: 'videos,credits,similar,recommendations,images'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

exports.getTVDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbFetch(`/tv/${id}`, {
      append_to_response: 'videos,credits,similar,recommendations,images'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TV details' });
  }
};

exports.searchMulti = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.json({ results: [], total_pages: 0, total_results: 0 });
    const data = await tmdbFetch('/search/multi', { query, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const { type = 'movie' } = req.query;
    const data = await tmdbFetch(`/genre/${type}/list`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

exports.discoverByGenre = async (req, res) => {
  try {
    const { genre_id, page = 1, type = 'movie' } = req.query;
    const data = await tmdbFetch(`/discover/${type}`, {
      with_genres: genre_id,
      page,
      sort_by: 'popularity.desc'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to discover by genre' });
  }
};

exports.getPopularPeople = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/person/popular', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch people' });
  }
};

exports.getPersonDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbFetch(`/person/${id}`, {
      append_to_response: 'movie_credits,tv_credits,images'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person details' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'movie', page = 1 } = req.query;
    const data = await tmdbFetch(`/${type}/${id}/recommendations`, { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
