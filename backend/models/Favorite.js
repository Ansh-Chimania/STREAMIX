const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tmdbId: {
    type: Number,
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  title: {
    type: String,
    required: true
  },
  posterPath: String,
  backdropPath: String,
  rating: Number,
  releaseDate: String,
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  overview: String
}, { timestamps: true });

favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
