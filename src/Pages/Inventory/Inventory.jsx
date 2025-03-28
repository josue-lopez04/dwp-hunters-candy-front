import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Inventory.css';
import ProductGrid from './Components/ProductGrid';
import ProductFilters from './Components/ProductFilters';
import SearchBar from '../../Components/SearchBar/SearchBar';
import Navbar from '../../Components/Navbar/Navbar';
import productService from '../../services/product.service';

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: initialCategory,
    priceRange: [0, 20000],
    sortBy: 'featured'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Actualizar searchParams cuando cambian los filtros
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (filters.category && filters.category !== 'all') {
      newParams.set('category', filters.category);
    } else {
      newParams.delete('category');
    }
    
    if (filters.sortBy && filters.sortBy !== 'featured') {
      newParams.set('sort', filters.sortBy);
    } else {
      newParams.delete('sort');
    }
    
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
  }, [filters, searchQuery, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los productos desde la API con los filtros
        const apiFilters = {
          category: filters.category !== 'all' ? filters.category : undefined,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sortBy: filters.sortBy,
          keyword: searchQuery
        };
        
        const response = await productService.getProducts(apiFilters);
        
        // Verificar la estructura de la respuesta
        if (response && response.products) {
          setProducts(response.products);
          setFilteredProducts(response.products);
        } else if (Array.isArray(response)) {
          setProducts(response);
          setFilteredProducts(response);
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="inventory-page">
      <Navbar />
      <div className="inventory-header">
        <h1>Catálogo de Productos</h1>
        <p>Encuentra todo lo que necesitas para tu próxima aventura de caza</p>
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fa fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <div className="inventory-content">
        <ProductFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="inventory-main">
          {loading ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="inventory-results">
                <p>Mostrando {filteredProducts.length} producto(s)</p>
              </div>
              
              <ProductGrid products={filteredProducts} />
              
              {filteredProducts.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">
                    <i className="fa fa-search"></i>
                  </div>
                  <h3>No se encontraron productos</h3>
                  <p>Prueba con otros filtros o términos de búsqueda.</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setFilters({
                        category: 'all',
                        priceRange: [0, 20000],
                        sortBy: 'featured'
                      });
                      setSearchQuery('');
                    }}
                  >
                    Restablecer filtros
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;