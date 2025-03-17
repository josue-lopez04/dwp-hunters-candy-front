import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const incrementQuantity = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}" de tu carrito?`)) {
      removeItem(item.id);
    }
  };

  const calculateItemTotal = () => {
    return item.price * item.quantity;
  };

  return (
    <div className="cart-item">
      <div className="item-product">
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="item-details">
          <Link to={`/inventory/${item.id}`} className="item-name">
            {item.name}
          </Link>
          <div className="item-meta">
            <span className="item-code">Código: PRD-{item.id.toString().padStart(5, '0')}</span>
            {item.stock <= 5 && (
              <span className="item-stock low-stock">
                Solo {item.stock} en stock
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="item-price">
        ${item.price.toFixed(2)}
      </div>
      
      <div className="item-quantity">
        <div className="quantity-selector">
          <button 
            className="quantity-btn minus"
            onClick={decrementQuantity}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            className="quantity-input" 
            value={item.quantity} 
            min="1"
            max={item.stock} 
            onChange={handleQuantityChange}
          />
          <button 
            className="quantity-btn plus"
            onClick={incrementQuantity}
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="item-total">
        ${calculateItemTotal().toFixed(2)}
      </div>
      
      <div className="item-actions">
        <button onClick={handleRemove} className="remove-item-btn">
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;