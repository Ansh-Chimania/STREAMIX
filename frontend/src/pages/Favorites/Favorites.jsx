import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites } from '../../store/slices/favoriteSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import { FiHeart } from 'react-icons/fi';
import './Favorites.css';

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(state => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <Loader fullPage />;

  return (
    <div className="favorites-page page-container">
      <div className="container">
        <h1 className="page-title"><FiHeart /> My Favorites</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <FiHeart size={60} />
            <h2>No favorites yet</h2>
            <p>Start adding movies and shows you love!</p>
            <button className="empty-btn" onClick={() => navigate('/')}>
              Explore Movies
            </button>
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
                  media_type: item.mediaType,
                  overview: item.overview
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

export default Favorites;
