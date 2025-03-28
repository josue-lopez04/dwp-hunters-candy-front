import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  
  // Actualizar query cuando cambia initialValue (para sincronización con URL)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    
    // Si el usuario borra toda la búsqueda, actualizar inmediatamente
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <i className="fa fa-search search-icon"></i>
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
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;