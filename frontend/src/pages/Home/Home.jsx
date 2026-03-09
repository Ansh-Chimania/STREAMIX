import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlaying,
  fetchPopularTV,
  fetchTopRatedTV
} from '../../store/slices/movieSlice';
import { fetchFavorites } from '../../store/slices/favoriteSlice';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import Loader from '../../components/Loader/Loader';
import Skeleton from '../../components/Loader/Skeleton';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { trending, popular, topRated, upcoming, nowPlaying, popularTV, topRatedTV, loading } = useSelector(state => state.movies);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchTrending({ timeWindow: 'week', page: 1 }));
    dispatch(fetchPopularMovies(1));
    dispatch(fetchTopRatedMovies(1));
    dispatch(fetchUpcomingMovies(1));
    dispatch(fetchNowPlaying(1));
    dispatch(fetchPopularTV(1));
    dispatch(fetchTopRatedTV(1));
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated]);

  if (loading && !trending.results.length) {
    return <Loader fullPage />;
  }

  return (
    <div className="home-page">
      <HeroBanner items={trending.results} />

      <div className="home-content">
        {trending.results.length ? (
          <MovieRow title="🔥 Trending This Week" items={trending.results} showMediaType />
        ) : <Skeleton />}

        {nowPlaying.results.length ? (
          <MovieRow title="🎬 Now Playing" items={nowPlaying.results} link="/explore/movie" />
        ) : <Skeleton />}

        {popular.results.length ? (
          <MovieRow title="🌟 Popular Movies" items={popular.results} link="/explore/movie" />
        ) : <Skeleton />}

        {popularTV.results.length ? (
          <MovieRow title="📺 Popular TV Shows" items={popularTV.results} link="/explore/tv" />
        ) : <Skeleton />}

        {topRated.results.length ? (
          <MovieRow title="⭐ Top Rated Movies" items={topRated.results} link="/explore/movie" />
        ) : <Skeleton />}

        {upcoming.results.length ? (
          <MovieRow title="🎥 Upcoming Movies" items={upcoming.results} />
        ) : <Skeleton />}

        {topRatedTV.results.length ? (
          <MovieRow title="🏆 Top Rated TV Shows" items={topRatedTV.results} link="/explore/tv" />
        ) : <Skeleton />}
      </div>
    </div>
  );
};

export default Home;
