import React, { useState } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ filters, onFilterChange }) => {
  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'armas', name: 'Armas y Municiones' },
    { id: 'ropa', name: 'Ropa Especializada' },
    { id: 'carnada', name: 'Carnada y Alimentos' },
    { id: 'accesorios', name: 'Accesorios y Herramientas' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'name-asc', label: 'Nombre: A-Z' },
    { value: 'name-desc', label: 'Nombre: Z-A' }
  ];
  
  // Estado para manejar el colapso de filtros en móvil
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(e.target.value);
    onFilterChange({ priceRange: newRange });
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  const resetFilters = () => {
    onFilterChange({
      category: 'all',
      priceRange: [0, 20000],
      sortBy: 'featured'
    });
  };

  return (
    <div className="product-filters-container">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button onClick={toggleFilters} className="toggle-filters-btn">
          {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>
      
      <div className={`product-filters ${filtersVisible ? 'visible' : ''}`}>
        <div className="filter-section">
          <h3>Categorías</h3>
          <div className="category-options">
            {categories.map(category => (
              <div className="category-option" key={category.id}>
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  value={category.id}
                  checked={filters.category === category.id}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={`category-${category.id}`}>{category.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Rango de Precio</h3>
          <div className="price-range">
            <div className="price-inputs">
              <div className="price-input">
                <label htmlFor="min-price">Min: $</label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  max={filters.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, 0)}
                />
              </div>
              <div className="price-input">
                <label htmlFor="max-price">Max: $</label>
                <input
                  type="number"
                  id="max-price"
                  min={filters.priceRange[0]}
                  max="20000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, 1)}
                />
              </div>
            </div>
            <div className="price-slider">
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e, 1)}
                className="slider"
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Ordenar por</h3>
          <select 
            className="sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-actions">
          <button onClick={resetFilters} className="reset-filters-btn">
            Restablecer filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;