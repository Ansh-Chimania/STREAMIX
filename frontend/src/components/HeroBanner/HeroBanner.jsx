import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlay, FiInfo, FiPlus, FiCheck } from 'react-icons/fi';
import { getBackdropUrl, getTitle, getReleaseDate, formatYear, truncateText, getTrailerKey, getMediaType } from '../../utils/helpers';
import { openTrailer } from '../../store/slices/uiSlice';
import { addFavorite, removeFavorite } from '../../store/slices/favoriteSlice';
import tmdbAPI from '../../api/tmdb';
import './HeroBanner.css';

const HeroBanner = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKeys, setTrailerKeys] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: favorites } = useSelector(state => state.favorites);
  const { isAuthenticated } = useSelector(state => state.auth);

  const validItems = items.filter(item =>
    item.backdrop_path && (item.title || item.name)
  ).slice(0, 8);

  const currentItem = validItems[currentIndex];

  useEffect(() => {
    if (!validItems.length) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validItems.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [validItems.length]);

  useEffect(() => {
    if (!currentItem) return;
    const id = currentItem.id;
    const type = getMediaType(currentItem);
    if (!trailerKeys[id]) {
      const fetchFn = type === 'tv' ? tmdbAPI.getTVDetail : tmdbAPI.getMovieDetail;
      fetchFn(id).then(({ data }) => {
        const key = getTrailerKey(data.videos);
        setTrailerKeys(prev => ({ ...prev, [id]: key }));
      }).catch(() => {});
    }
  }, [currentItem]);

  if (!currentItem) return null;

  const mediaType = getMediaType(currentItem);
  const title = getTitle(currentItem);
  const year = formatYear(getReleaseDate(currentItem));
  const overview = truncateText(currentItem.overview, 280);
  const rating = currentItem.vote_average?.toFixed(1);
  const isFavorite = favorites.some(f => f.tmdbId === currentItem.id);

  const handlePlayTrailer = () => {
    const key = trailerKeys[currentItem.id];
    if (key) {
      dispatch(openTrailer({ key, title }));
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return navigate('/login');
    if (isFavorite) {
      dispatch(removeFavorite(currentItem.id));
    } else {
      dispatch(addFavorite({
        tmdbId: currentItem.id,
        title,
        posterPath: currentItem.poster_path,
        backdropPath: currentItem.backdrop_path,
        rating: currentItem.vote_average,
        releaseDate: getReleaseDate(currentItem),
        mediaType,
        overview: currentItem.overview
      }));
    }
  };

  return (
    <div className="hero-banner">
      <div className="hero-backdrop" style={{ backgroundImage: `url(${getBackdropUrl(currentItem.backdrop_path, 'original')})` }} />
      <div className="hero-gradient" />

      <div className="hero-content container">
        <div className="hero-meta">
          {rating && <span className="hero-rating">⭐ {rating}</span>}
          <span className="hero-type">{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
          {year && <span className="hero-year">{year}</span>}
        </div>

        <h1 className="hero-title">{title}</h1>
        <p className="hero-overview">{overview}</p>

        <div className="hero-actions">
          <button className="hero-btn play-btn" onClick={handlePlayTrailer}>
            <FiPlay /> Play Trailer
          </button>
          <button className="hero-btn info-btn" onClick={() => navigate(`/${mediaType}/${currentItem.id}`)}>
            <FiInfo /> More Info
          </button>
          <button className={`hero-btn fav-btn ${isFavorite ? 'active' : ''}`} onClick={handleToggleFavorite}>
            {isFavorite ? <FiCheck /> : <FiPlus />}
          </button>
        </div>

        <div className="hero-indicators">
          {validItems.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
