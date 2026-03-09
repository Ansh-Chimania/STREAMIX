const express = require('express');
const router = express.Router();
const { getMovies, getMovie, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', getMovies);
router.get('/:id', getMovie);
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;
