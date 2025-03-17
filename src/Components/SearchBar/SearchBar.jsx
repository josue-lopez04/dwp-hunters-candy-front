import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar productos..."
            value={query}
            onChange={handleChange}
          />
          {query && (
            <button 
              type="button"
              className="clear-search-btn"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
            >
              <i className="fa fa-times"></i>
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          <i className="fa fa-search"></i>
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;