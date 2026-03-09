import { TMDB_IMAGE_BASE, POSTER_SIZES, BACKDROP_SIZES, PROFILE_SIZES, PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP, PLACEHOLDER_AVATAR, GENRES } from './constants';

export const getPosterUrl = (path, size = 'medium') => {
  if (!path) return PLACEHOLDER_POSTER;
  return `${TMDB_IMAGE_BASE}${POSTER_SIZES[size]}${path}`;
};

export const getBackdropUrl = (path, size = 'large') => {
  if (!path) return PLACEHOLDER_BACKDROP;
  return `${TMDB_IMAGE_BASE}${BACKDROP_SIZES[size]}${path}`;
};

export const getProfileUrl = (path, size = 'medium') => {
  if (!path) return PLACEHOLDER_AVATAR;
  return `${TMDB_IMAGE_BASE}${PROFILE_SIZES[size]}${path}`;
};

export const getGenreNames = (genreIds = []) => {
  return genreIds.map(id => GENRES[id] || 'Unknown').filter(Boolean);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Release date unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export const formatYear = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

export const truncateText = (text, maxLength = 200) => {
  if (!text) return 'Description not available';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getTrailerKey = (videos) => {
  if (!videos || !videos.results || !videos.results.length) return null;
  const trailer = videos.results.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const teaser = videos.results.find(
    v => v.type === 'Teaser' && v.site === 'YouTube'
  );
  return trailer?.key || teaser?.key || videos.results[0]?.key || null;
};

export const getMediaType = (item) => {
  if (item.media_type) return item.media_type;
  if (item.title) return 'movie';
  if (item.name && item.first_air_date) return 'tv';
  return 'movie';
};

export const getTitle = (item) => {
  return item.title || item.name || 'Untitled';
};

export const getReleaseDate = (item) => {
  return item.release_date || item.first_air_date || '';
};
