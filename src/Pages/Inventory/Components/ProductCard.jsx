import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { useSocket } from '../../context/SocketContext';
import './ProductCard.css';

/**
 * ProductCard component for displaying product information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @returns {JSX.Element} ProductCard component
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { checkProductStock } = useSocket();
  
  // Ensure we have valid product data
  if (!product) return null;
  
  // Get product ID (handle both _id from MongoDB and id from local data)
  const productId = product._id || product.id;
  
  // Calculate final price with discount if applicable
  const finalPrice = product.finalPrice || 
    (product.discount ? product.price * (1 - product.discount / 100) : product.price);
  
  // Determine the image to display
  const productImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : (product.image || '/images/placeholder.jpg');
  
  // Determine stock status
  const stockStatus = product.stock <= 0 ? 'out-of-stock' : 
                     product.stock <= 5 ? 'low-stock' : 'in-stock';
  
  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, 1);
      
      // Check product stock after adding to cart
      checkProductStock(product);
      
      // Show toast notification
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
    }
  };

  return (
    <div className={`product-card ${stockStatus}`}>
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
            onClick={handleAddToCart}
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
};

export default ProductCard;