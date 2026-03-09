import API from './axios';

const tmdb = {
  getTrending: (timeWindow = 'week', page = 1) =>
    API.get(`/tmdb/trending?time_window=${timeWindow}&page=${page}`),
  
  getPopularMovies: (page = 1) =>
    API.get(`/tmdb/movies/popular?page=${page}`),
  
  getTopRatedMovies: (page = 1) =>
    API.get(`/tmdb/movies/top-rated?page=${page}`),
  
  getUpcomingMovies: (page = 1) =>
    API.get(`/tmdb/movies/upcoming?page=${page}`),
  
  getNowPlayingMovies: (page = 1) =>
    API.get(`/tmdb/movies/now-playing?page=${page}`),
  
  getPopularTV: (page = 1) =>
    API.get(`/tmdb/tv/popular?page=${page}`),
  
  getTopRatedTV: (page = 1) =>
    API.get(`/tmdb/tv/top-rated?page=${page}`),
  
  getAiringTodayTV: (page = 1) =>
    API.get(`/tmdb/tv/airing-today?page=${page}`),
  
  getMovieDetail: (id) =>
    API.get(`/tmdb/movie/${id}`),
  
  getTVDetail: (id) =>
    API.get(`/tmdb/tv/${id}`),
  
  searchMulti: (query, page = 1) =>
    API.get(`/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`),
  
  getGenres: (type = 'movie') =>
    API.get(`/tmdb/genres?type=${type}`),
  
  discoverByGenre: (genreId, page = 1, type = 'movie') =>
    API.get(`/tmdb/discover?genre_id=${genreId}&page=${page}&type=${type}`),
  
  getPopularPeople: (page = 1) =>
    API.get(`/tmdb/people?page=${page}`),
  
  getPersonDetail: (id) =>
    API.get(`/tmdb/person/${id}`),
  
  getRecommendations: (id, type = 'movie', page = 1) =>
    API.get(`/tmdb/recommendations/${id}?type=${type}&page=${page}`)
};

export default tmdb;
