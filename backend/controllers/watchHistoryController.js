const WatchHistory = require('../models/WatchHistory');

exports.getWatchHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const history = await WatchHistory.find({ user: req.user.id })
      .sort({ watchedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await WatchHistory.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      history,
      page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_results: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const { tmdbId, title, posterPath, backdropPath, rating, releaseDate, mediaType, overview, watchType } = req.body;

    // Update if exists, create if not (upsert-like)
    const existing = await WatchHistory.findOne({
      user: req.user.id,
      tmdbId,
      watchType
    });

    if (existing) {
      existing.watchedAt = new Date();
      await existing.save();
      return res.json({ success: true, history: existing });
    }

    const history = await WatchHistory.create({
      user: req.user.id,
      tmdbId,
      title,
      posterPath,
      backdropPath,
      rating,
      releaseDate,
      mediaType,
      overview,
      watchType
    });

    res.status(201).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.user.id });
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
