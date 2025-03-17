import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Inventory.css';
import ProductGrid from './Components/ProductGrid';
import ProductFilters from './Components/ProductFilters';
import SearchBar from '../../Components/SearchBar/SearchBar';
import Navbar from '../../Components/Navbar/Navbar';

const Inventory = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: initialCategory,
    priceRange: [0, 20000],
    sortBy: 'featured'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Rifle de caza XH-200",
          image: "/rifle.webp",
          price: 12999.99,
          category: "armas",
          description: "Rifle de alto rendimiento con mira telescópica incluida",
          stock: 15
        },
        {
          id: 2,
          name: "Chaqueta Camuflaje Premium",
          image: "/chaqueta.jpeg",
          price: 2499.99,
          category: "ropa",
          description: "Chaqueta resistente al agua con patrón de camuflaje forestal",
          stock: 8
        },
        {
          id: 3,
          name: "Kit de Carnada Profesional",
          image: "/kit_carnada.jpeg",
          price: 899.99,
          category: "carnada",
          description: "Set completo con diferentes tipos de carnada para diversos animales",
          stock: 30
        },
        {
          id: 4,
          name: "Botas de Caza Impermeables",
          image: "/botas_impermeable.webp",
          price: 1899.99,
          category: "ropa",
          description: "Botas de alta resistencia con suela antideslizante para terrenos difíciles",
          stock: 12
        },
        {
          id: 5,
          name: "Mira Telescópica HD 4-16x50mm",
          image: "/mira_telescopica.webp",
          price: 4999.99,
          category: "accesorios",
          description: "Mira telescópica de alta definición con zoom de 4x a 16x",
          stock: 5
        },
        {
          id: 6,
          name: "Kit de Limpieza para Rifles",
          image: "/kit.jpg",
          price: 599.99,
          category: "accesorios",
          description: "Kit completo para la limpieza y mantenimiento de rifles",
          stock: 25
        },
        {
          id: 7,
          name: "Munición Premium .308",
          image: "/balas.webp",
          price: 799.99,
          category: "armas",
          description: "Caja de munición calibre .308 de alta precisión",
          stock: 50
        },
        {
          id: 8,
          name: "Tienda de Campaña Camuflaje",
          image: "/campaña.jpeg", 
          price: 3499.99,
          category: "accesorios",
          description: "Tienda de campaña resistente con patrón de camuflaje",
          stock: 3
        },
        {
          id: 9,
          name: "Pantalones Tácticos Impermeables",
          image: "/images/products/pantalones-tacticos.jpg",
          price: 1299.99,
          category: "ropa",
          description: "Pantalones tácticos con múltiples bolsillos y resistentes al agua",
          stock: 18
        },
        {
          id: 10,
          name: "Kit de Supervivencia Avanzado",
          image: "/images/products/kit-supervivencia.jpg",
          price: 1999.99,
          category: "accesorios",
          description: "Kit completo con todo lo necesario para situaciones de supervivencia",
          stock: 7
        },
        {
          id: 11,
          name: "Chaleco Táctico Multibolsillos",
          image: "/images/products/chaleco-tactico.jpg",
          price: 1799.99,
          category: "ropa",
          description: "Chaleco táctico con múltiples bolsillos y ajustes personalizables",
          stock: 9
        },
        {
          id: 12,
          name: "Binoculares de Alta Precisión",
          image: "/images/products/binoculares.jpg",
          price: 2999.99,
          category: "accesorios",
          description: "Binoculares con zoom 10x42 y visión nocturna",
          stock: 6
        }
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }
    
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, filters, searchQuery]);

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
        <SearchBar onSearch={handleSearch} />
      </div>
      
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
                <p>Mostrando {filteredProducts.length} de {products.length} productos</p>
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