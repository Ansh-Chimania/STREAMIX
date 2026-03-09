const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  posterPath: {
    type: String,
    default: ''
  },
  backdropPath: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Description not available'
  },
  releaseDate: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  voteCount: {
    type: Number,
    default: 0
  },
  genres: [{
    id: Number,
    name: String
  }],
  category: {
    type: String,
    enum: ['movie', 'tv', 'custom'],
    default: 'movie'
  },
  trailerKey: {
    type: String,
    default: ''
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  runtime: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  popularity: {
    type: Number,
    default: 0
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
