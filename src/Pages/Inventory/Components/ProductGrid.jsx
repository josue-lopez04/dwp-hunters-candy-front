import React from 'react';
import { Link } from 'react-router-dom';
import './ProductGrid.css';
import { useCart } from '../../../context/CartContext';

const ProductGrid = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    
    // Mostrar notificación usando un toast personalizado
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fa fa-check-circle"></i>
        <span>${product.name} añadido al carrito</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => {
        // Asegurar que tenemos un ID válido
        const productId = product._id || product.id;
        
        // Calcular precio final con descuento si no existe
        const finalPrice = product.finalPrice || 
          (product.discount ? product.price * (1 - product.discount / 100) : product.price);
        
        // Determinar la imagen a mostrar
        const productImage = Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : (product.image || '/images/placeholder.jpg');
        
        // Calcular porcentaje de stock restante para mostrar visualmente
        const stockStatus = product.stock <= 0 ? 'out-of-stock' : 
                           product.stock <= 5 ? 'low-stock' : 'in-stock';
        
        return (
          <div key={productId} className={`product-card ${stockStatus}`}>
            <div className="product-image">
              <Link to={`/inventory/${productId}`}>
                <img src={productImage} alt={product.name} />
              </Link>
              
              {product.stock <= 5 && product.stock > 0 && (
                <div className="stock-badge low-stock">
                  ¡Pocas unidades!
                </div>
              )}
              
              {product.stock <= 0 && (
                <div className="stock-badge out-of-stock">
                  Agotado
                </div>
              )}
              
              {product.discount > 0 && (
                <div className="discount-badge">
                  -{product.discount}%
                </div>
              )}
              
              {product.featured && (
                <div className="featured-badge">
                  Destacado
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">
                <Link to={`/inventory/${productId}`}>{product.name}</Link>
              </h3>
              
              <div className="product-price-container">
                {product.discount > 0 ? (
                  <>
                    <span className="product-original-price">${product.price.toFixed(2)}</span>
                    <span className="product-price">${finalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="product-price">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              {/* Sección de rating solo si hay rating */}
              {product.rating && product.rating > 0 ? (
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fa fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                  {product.numReviews && product.numReviews > 0 ? (
                    <span className="rating-count">({product.numReviews})</span>
                  ) : null}
                </div>
              ) : null}
              
              {/* Descripción del producto */}
              <p className="product-description">
                {product.description && product.description.length > 100 
                  ? `${product.description.substring(0, 100)}...` 
                  : product.description}
              </p>
              
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Agotado' : (
                    <>
                      <i className="fa fa-shopping-cart"></i> Añadir
                    </>
                  )}
                </button>
                <Link to={`/inventory/${productId}`} className="view-details-btn">
                  <i className="fa fa-eye"></i> Ver detalles
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;