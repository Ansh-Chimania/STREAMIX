const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tmdbId: {
    type: Number,
    required: true
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
  overview: String,
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchType: {
    type: String,
    enum: ['page_view', 'trailer_watch'],
    default: 'page_view'
  }
}, { timestamps: true });

watchHistorySchema.index({ user: 1, tmdbId: 1 });
watchHistorySchema.index({ user: 1, watchedAt: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
