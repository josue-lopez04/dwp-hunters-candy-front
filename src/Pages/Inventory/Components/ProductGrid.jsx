import React from 'react';
import { Link } from 'react-router-dom';
import './productgrid.css';
const ProductGrid = ({ products }) => {
  const handleAddToCart = (product) => {
    alert(`${product.name} añadido al carrito`);
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
            {product.stock <= 5 && (
              <div className="stock-badge low-stock">
                ¡Pocas unidades!
              </div>
            )}
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
              </button>
              <Link to={`/inventory/${product.id}`} className="view-details-btn">
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;