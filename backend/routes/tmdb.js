const express = require('express');
const router = express.Router();
const tmdb = require('../controllers/tmdbController');

router.get('/trending', tmdb.getTrending);
router.get('/movies/popular', tmdb.getPopularMovies);
router.get('/movies/top-rated', tmdb.getTopRatedMovies);
router.get('/movies/upcoming', tmdb.getUpcomingMovies);
router.get('/movies/now-playing', tmdb.getNowPlayingMovies);
router.get('/tv/popular', tmdb.getPopularTV);
router.get('/tv/top-rated', tmdb.getTopRatedTV);
router.get('/tv/airing-today', tmdb.getAiringTodayTV);
router.get('/movie/:id', tmdb.getMovieDetail);
router.get('/tv/:id', tmdb.getTVDetail);
router.get('/search', tmdb.searchMulti);
router.get('/genres', tmdb.getGenres);
router.get('/discover', tmdb.discoverByGenre);
router.get('/people', tmdb.getPopularPeople);
router.get('/person/:id', tmdb.getPersonDetail);
router.get('/recommendations/:id', tmdb.getRecommendations);

module.exports = router;
