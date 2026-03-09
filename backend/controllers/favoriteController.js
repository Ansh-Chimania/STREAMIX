const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { tmdbId, title, posterPath, backdropPath, rating, releaseDate, mediaType, overview } = req.body;

    const existing = await Favorite.findOne({ user: req.user.id, tmdbId });
    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      tmdbId,
      title,
      posterPath,
      backdropPath,
      rating,
      releaseDate,
      mediaType,
      overview
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    await Favorite.findOneAndDelete({ user: req.user.id, tmdbId: parseInt(tmdbId) });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const favorite = await Favorite.findOne({ user: req.user.id, tmdbId: parseInt(tmdbId) });
    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
