import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import CartItem from './Components/CartItem';
import Navbar from '../../Components/Navbar/Navbar';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { 
    cartItems,
    loading,
    couponCode,
    couponApplied,
    discountAmount,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon: applyCartCoupon,
    removeCoupon,
    calculateSubtotal,
    calculateTotal
  } = useCart();
  
  const [localCouponCode, setLocalCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    
    try {
      await applyCartCoupon(localCouponCode);
    } catch (error) {
      setCouponError(error.message || 'Cupón inválido o expirado');
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      
      {cartItems.length === 0 ? (
        <div className="cart-container cart-empty">
          <div className="cart-empty-icon">
            <i className="fa fa-shopping-cart"></i>
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Parece que no has añadido ningún producto a tu carrito de compras.</p>
          <Link to="/inventory" className="continue-shopping-btn">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-header">
            <h1>Tu Carrito</h1>
            <div className="cart-actions">
              <Link to="/inventory" className="continue-shopping-link">
                <i className="fa fa-arrow-left"></i> Seguir comprando
              </Link>
              <button onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
                  clearCart();
                }
              }} className="clear-cart-btn">
                <i className="fa fa-trash"></i> Vaciar carrito
              </button>
            </div>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <div className="item-product">Producto</div>
                <div className="item-price">Precio</div>
                <div className="item-quantity">Cantidad</div>
                <div className="item-total">Total</div>
                <div className="item-actions">Acciones</div>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    updateQuantity={updateItemQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <h2>Resumen del pedido</h2>
              
              <div className="coupon-section">
                <h3>Cupón de descuento</h3>
                {couponApplied ? (
                  <div className="coupon-applied">
                    <div className="coupon-info">
                      <span className="coupon-code">{couponCode}</span>
                      <span className="coupon-discount">-${discountAmount.toFixed(2)}</span>
                    </div>
                    <button onClick={removeCoupon} className="remove-coupon-btn">
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="coupon-form">
                    <input
                      type="text"
                      placeholder="Ingresa tu código"
                      value={localCouponCode}
                      onChange={(e) => setLocalCouponCode(e.target.value)}
                      className="coupon-input"
                    />
                    <button type="submit" className="apply-coupon-btn">
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && <div className="coupon-error">{couponError}</div>}
              </div>
              
              <div className="cart-totals">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {couponApplied && (
                  <div className="cart-total-row discount">
                    <span>Descuento</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="cart-total-row shipping">
                  <span>Envío</span>
                  <span>Calculado en el siguiente paso</span>
                </div>
                
                <div className="cart-total-row grand-total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="checkout-section">
                <Link to="/checkout" className="checkout-btn">
                  Proceder al pago <i className="fa fa-arrow-right"></i>
                </Link>
                <div className="payment-methods">
                  <p>Métodos de pago aceptados:</p>
                  <div className="payment-icons">
                    <i className="fa fa-cc-visa"></i>
                    <i className="fa fa-cc-mastercard"></i>
                    <i className="fa fa-cc-amex"></i>
                    <i className="fa fa-cc-paypal"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;