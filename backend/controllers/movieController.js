const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('addedBy', 'name');

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      results: movies,
      page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_results: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'name');
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      isCustom: true,
      addedBy: req.user.id
    });
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
