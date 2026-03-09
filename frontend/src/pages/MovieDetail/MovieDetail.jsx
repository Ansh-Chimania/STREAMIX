import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlay, FiHeart, FiStar, FiCalendar, FiClock, FiGlobe } from 'react-icons/fi';
import { fetchMovieDetail, clearDetail } from '../../store/slices/movieSlice';
import { addFavorite, removeFavorite, fetchFavorites } from '../../store/slices/favoriteSlice';
import { addToWatchHistory } from '../../store/slices/watchHistorySlice';
import { openTrailer } from '../../store/slices/uiSlice';
import MovieRow from '../../components/MovieRow/MovieRow';
import Loader from '../../components/Loader/Loader';
import { getBackdropUrl, getPosterUrl, getTitle, getReleaseDate, formatDate, formatRuntime, formatRating, getTrailerKey, truncateText } from '../../utils/helpers';
import './MovieDetail.css';

const MovieDetail = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDetail: movie, detailLoading } = useSelector(state => state.movies);
  const { items: favorites } = useSelector(state => state.favorites);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieDetail({ id, type: type || 'movie' }));
    if (isAuthenticated) dispatch(fetchFavorites());
    window.scrollTo(0, 0);

    return () => dispatch(clearDetail());
  }, [id, type, dispatch, isAuthenticated]);

  useEffect(() => {
    if (movie && isAuthenticated) {
      dispatch(addToWatchHistory({
        tmdbId: movie.id,
        title: getTitle(movie),
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        rating: movie.vote_average,
        releaseDate: getReleaseDate(movie),
        mediaType: type || 'movie',
        overview: movie.overview,
        watchType: 'page_view'
      }));
    }
  }, [movie, isAuthenticated]);

  if (detailLoading || !movie) return <Loader fullPage />;

  const title = getTitle(movie);
  const trailerKey = getTrailerKey(movie.videos);
  const isFavorite = favorites.some(f => f.tmdbId === movie.id);
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = movie.similar?.results || [];
  const recommendations = movie.recommendations?.results || [];
  const genres = movie.genres || [];

  const handlePlayTrailer = () => {
    if (trailerKey) {
      dispatch(openTrailer({ key: trailerKey, title }));
      if (isAuthenticated) {
        dispatch(addToWatchHistory({
          tmdbId: movie.id,
          title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          rating: movie.vote_average,
          releaseDate: getReleaseDate(movie),
          mediaType: type || 'movie',
          overview: movie.overview,
          watchType: 'trailer_watch'
        }));
      }
    } else {
      dispatch(openTrailer({ key: null, title }));
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return navigate('/login');
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite({
        tmdbId: movie.id,
        title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        rating: movie.vote_average,
        releaseDate: getReleaseDate(movie),
        mediaType: type || 'movie',
        overview: movie.overview
      }));
    }
  };

  return (
    <div className="detail-page">
      {/* Backdrop */}
      <div className="detail-backdrop" style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})` }}>
        <div className="detail-backdrop-gradient" />
      </div>

      {/* Main Content */}
      <div className="detail-main container">
        <div className="detail-poster">
          <img src={getPosterUrl(movie.poster_path, 'large')} alt={title} />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{title}</h1>

          <div className="detail-meta">
            {movie.vote_average > 0 && (
              <span className="meta-item rating">
                <FiStar /> {formatRating(movie.vote_average)}
                <span className="vote-count">({movie.vote_count} votes)</span>
              </span>
            )}
            <span className="meta-item">
              <FiCalendar /> {formatDate(getReleaseDate(movie))}
            </span>
            {(movie.runtime || movie.episode_run_time?.[0]) && (
              <span className="meta-item">
                <FiClock /> {formatRuntime(movie.runtime || movie.episode_run_time?.[0])}
              </span>
            )}
            {movie.original_language && (
              <span className="meta-item">
                <FiGlobe /> {movie.original_language?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="detail-genres">
            {genres.map(g => (
              <span key={g.id} className="genre-tag"
                onClick={() => navigate(`/explore/${type || 'movie'}?genre=${g.id}`)}>
                {g.name}
              </span>
            ))}
          </div>

          {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

          <div className="detail-overview">
            <h3>Overview</h3>
            <p>
              {showFullOverview
                ? (movie.overview || 'Description not available')
                : truncateText(movie.overview, 400)}
            </p>
            {movie.overview && movie.overview.length > 400 && (
              <button className="read-more" onClick={() => setShowFullOverview(!showFullOverview)}>
                {showFullOverview ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>

          <div className="detail-actions">
            <button className="detail-btn play" onClick={handlePlayTrailer}>
              <FiPlay /> {trailerKey ? 'Watch Trailer' : 'Trailer Unavailable'}
            </button>
            <button className={`detail-btn fav ${isFavorite ? 'active' : ''}`} onClick={handleToggleFavorite}>
              <FiHeart /> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>

          {/* Seasons for TV */}
          {type === 'tv' && movie.number_of_seasons && (
            <div className="detail-seasons">
              <span>{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span>
              <span> · {movie.number_of_episodes} Episodes</span>
              {movie.status && <span> · {movie.status}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="detail-section container">
          <h2 className="section-title">Cast</h2>
          <div className="cast-grid">
            {cast.map(person => (
              <div key={person.id} className="cast-card" onClick={() => navigate(`/person/${person.id}`)}>
                <img
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278/141414/666?text=No+Photo'}
                  alt={person.name}
                  loading="lazy"
                />
                <div className="cast-info">
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-character">{person.character || person.roles?.[0]?.character || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <MovieRow title="Recommended For You" items={recommendations} />
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <MovieRow title="Similar Titles" items={similar} />
      )}
    </div>
  );
};

export default MovieDetail;
