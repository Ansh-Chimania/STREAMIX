import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const MovieForm = ({ movie, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    posterPath: movie?.posterPath || '',
    backdropPath: movie?.backdropPath || '',
    releaseDate: movie?.releaseDate || '',
    rating: movie?.rating || 0,
    category: movie?.category || 'movie',
    trailerUrl: movie?.trailerUrl || '',
    trailerKey: movie?.trailerKey || '',
    tmdbId: movie?.tmdbId || '',
    language: movie?.language || 'en',
    runtime: movie?.runtime || 0
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (movie) {
        await API.put(`/movies/${movie._id}`, form);
        toast.success('Movie updated');
      } else {
        await API.post('/movies', form);
        toast.success('Movie added');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="movie-form-card">
      <div className="form-card-header">
        <h3>{movie ? 'Edit Movie' : 'Add New Movie'}</h3>
        <button className="form-close" onClick={onCancel}><FiX /></button>
      </div>

      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
              <option value="movie">Movie</option>
              <option value="tv">TV Show</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={e => handleChange('description', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Poster Image URL</label>
            <input type="text" value={form.posterPath} onChange={e => handleChange('posterPath', e.target.value)} placeholder="/path or full URL" />
          </div>
          <div className="form-group">
            <label>Backdrop Image URL</label>
            <input type="text" value={form.backdropPath} onChange={e => handleChange('backdropPath', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Release Date</label>
            <input type="date" value={form.releaseDate} onChange={e => handleChange('releaseDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rating (0-10)</label>
            <input type="number" min="0" max="10" step="0.1" value={form.rating} onChange={e => handleChange('rating', parseFloat(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Runtime (min)</label>
            <input type="number" value={form.runtime} onChange={e => handleChange('runtime', parseInt(e.target.value))} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>YouTube Trailer Key</label>
            <input type="text" value={form.trailerKey} onChange={e => handleChange('trailerKey', e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
          </div>
          <div className="form-group">
            <label>TMDB ID</label>
            <input type="number" value={form.tmdbId} onChange={e => handleChange('tmdbId', parseInt(e.target.value))} />
          </div>
        </div>

        <div className="form-actions-row">
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="save-btn" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
