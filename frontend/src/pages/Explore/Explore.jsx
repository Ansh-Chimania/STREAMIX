import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularMovies, fetchTopRatedMovies, fetchPopularTV, fetchByGenre, clearGenreResults } from '../../store/slices/movieSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { GENRES } from '../../utils/constants';
import './Explore.css';

const Explore = () => {
  const { type = 'movie' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const [sortBy, setSortBy] = useState('popular');
  const dispatch = useDispatch();
  const { popular, topRated, popularTV, genreResults, loading } = useSelector(state => state.movies);

  const currentData = genreFilter ? genreResults :
    type === 'tv' ? popularTV :
      sortBy === 'top_rated' ? topRated : popular;

  const page = currentData.page || 1;
  const totalPages = currentData.total_pages || 1;
  const hasMore = page < totalPages;

  useEffect(() => {
    dispatch(clearGenreResults());
    if (genreFilter) {
      dispatch(fetchByGenre({ genreId: genreFilter, page: 1, type }));
    } else if (type === 'tv') {
      dispatch(fetchPopularTV(1));
    } else if (sortBy === 'top_rated') {
      dispatch(fetchTopRatedMovies(1));
    } else {
      dispatch(fetchPopularMovies(1));
    }
  }, [type, sortBy, genreFilter, dispatch]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    if (genreFilter) {
      dispatch(fetchByGenre({ genreId: genreFilter, page: nextPage, type }));
    } else if (type === 'tv') {
      dispatch(fetchPopularTV(nextPage));
    } else if (sortBy === 'top_rated') {
      dispatch(fetchTopRatedMovies(nextPage));
    } else {
      dispatch(fetchPopularMovies(nextPage));
    }
  }, [page, type, sortBy, genreFilter, dispatch]);

  useInfiniteScroll(loadMore, hasMore);

  const genreList = Object.entries(GENRES).filter(([id]) => {
    if (type === 'tv') return parseInt(id) >= 10759 || parseInt(id) <= 37;
    return parseInt(id) < 10759;
  });

  const handleGenreClick = (genreId) => {
    if (genreFilter === String(genreId)) {
      setSearchParams({});
    } else {
      setSearchParams({ genre: genreId });
    }
  };

  return (
    <div className="explore-page page-container">
      <div className="container">
        <div className="explore-header">
          <h1>{type === 'tv' ? '📺 TV Shows' : '🎬 Movies'}</h1>

          {!genreFilter && type === 'movie' && (
            <div className="explore-sort">
              <button className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
                onClick={() => setSortBy('popular')}>Popular</button>
              <button className={`sort-btn ${sortBy === 'top_rated' ? 'active' : ''}`}
                onClick={() => setSortBy('top_rated')}>Top Rated</button>
            </div>
          )}
        </div>

        <div className="genre-filters">
          {genreList.map(([id, name]) => (
            <button key={id}
              className={`genre-filter-btn ${genreFilter === id ? 'active' : ''}`}
              onClick={() => handleGenreClick(id)}>
              {name}
            </button>
          ))}
        </div>

        <div className="explore-grid">
          {currentData.results?.map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} item={{ ...item, media_type: type }} />
          ))}
        </div>

        {loading && page === 1 && <Loader />}
        {loading && page > 1 && <div className="loading-more">Loading more...</div>}

        {!loading && !currentData.results?.length && (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
