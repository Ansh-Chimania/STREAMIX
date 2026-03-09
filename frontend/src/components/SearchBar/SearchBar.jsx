import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import useDebounce from '../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ initialQuery = '', onSearch, autoFocus = false, large = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (onSearch && debouncedQuery !== undefined) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form className={`search-bar ${large ? 'large' : ''}`} onSubmit={handleSubmit}>
      <FiSearch className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, TV shows, people..."
        className="search-input"
      />
      {query && (
        <button type="button" className="search-clear" onClick={handleClear}>
          <FiX />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
