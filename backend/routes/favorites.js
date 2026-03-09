const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:tmdbId', protect, removeFavorite);
router.get('/check/:tmdbId', protect, checkFavorite);

module.exports = router;
