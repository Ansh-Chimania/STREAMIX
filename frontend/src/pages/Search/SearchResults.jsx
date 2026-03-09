import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchContent, clearSearch } from '../../store/slices/searchSlice';
import SearchBar from '../../components/SearchBar/SearchBar';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const { results, loading, page, total_pages, total_results, query } = useSelector(state => state.search);

  const hasMore = page < total_pages;

  useEffect(() => {
    if (queryParam) {
      dispatch(searchContent({ query: queryParam, page: 1 }));
    }
    return () => dispatch(clearSearch());
  }, [queryParam, dispatch]);

  const handleSearch = (newQuery) => {
    if (newQuery && newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else if (!newQuery) {
      setSearchParams({});
      dispatch(clearSearch());
    }
  };

  const loadMore = useCallback(async () => {
    if (query) {
      dispatch(searchContent({ query, page: page + 1 }));
    }
  }, [query, page, dispatch]);

  useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="search-page page-container">
      <div className="container">
        <div className="search-page-header">
          <h1>🔍 Search</h1>
          <SearchBar initialQuery={queryParam} onSearch={handleSearch} autoFocus large />
        </div>

        {query && (
          <p className="search-info">
            {total_results > 0
              ? `Found ${total_results} results for "${query}"`
              : loading ? 'Searching...' : `No results for "${query}"`}
          </p>
        )}

        <div className="search-grid">
          {results.filter(r => r.poster_path || r.profile_path).map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} item={item} showMediaType />
          ))}
        </div>

        {loading && <Loader />}
      </div>
    </div>
  );
};

export default SearchResults;
