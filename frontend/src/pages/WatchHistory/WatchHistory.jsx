import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchHistory, clearWatchHistory } from '../../store/slices/watchHistorySlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import './WatchHistory.css';

const WatchHistory = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.watchHistory);

  useEffect(() => {
    dispatch(fetchWatchHistory());
  }, [dispatch]);

  const handleClear = () => {
    if (window.confirm('Clear all watch history?')) {
      dispatch(clearWatchHistory());
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="history-page page-container">
      <div className="container">
        <div className="history-header">
          <h1 className="page-title"><FiClock /> Watch History</h1>
          {items.length > 0 && (
            <button className="clear-history-btn" onClick={handleClear}>
              <FiTrash2 /> Clear History
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <FiClock size={60} />
            <h2>No watch history</h2>
            <p>Movies and shows you visit will appear here.</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {items.map(item => (
              <MovieCard
                key={item._id}
                item={{
                  id: item.tmdbId,
                  title: item.title,
                  name: item.mediaType === 'tv' ? item.title : undefined,
                  poster_path: item.posterPath,
                  backdrop_path: item.backdropPath,
                  vote_average: item.rating,
                  release_date: item.releaseDate,
                  first_air_date: item.mediaType === 'tv' ? item.releaseDate : undefined,
                  media_type: item.mediaType
                }}
                showMediaType
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
