import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import CartItem from './Components/CartItem';
import Navbar from '../../Components/Navbar/Navbar';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  
  useEffect(() => {
    
    setTimeout(() => {
      const mockCartItems = [
        {
          id: 1,
          name: "Rifle de caza XH-200",
          price: 11699.99,
          quantity: 1,
          image: "/rifle.webp",
          stock: 15
        },
        {
          id: 2,
          name: "Mira telescópica HD",
          price: 2499.99,
          quantity: 1,
          image: "/images/products/mira-telescopica.jpg",
          stock: 8
        },
        {
          id: 3,
          name: "Kit de limpieza para rifle",
          price: 599.99,
          quantity: 2,
          image: "/images/products/kit-limpieza.jpg",
          stock: 20
        }
      ];
      
      setCartItems(mockCartItems);
      setLoading(false);
    }, 800);
  }, []);

  const updateItemQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      setCartItems([]);
    }
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    
    if (couponCode.trim() === 'HUNTER20') {
      setCouponApplied(true);
      
      setDiscountAmount(calculateSubtotal() * 0.2);
      alert('Cupón aplicado correctamente: 20% de descuento');
    } else {
      alert('Cupón inválido o expirado');
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discountAmount;
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu carrito...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <i className="fa fa-shopping-cart"></i>
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que no has añadido ningún producto a tu carrito de compras.</p>
        <Link to="/inventory" className="continue-shopping-btn">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
            <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
          <div className="cart-actions">
            <Link to="/inventory" className="continue-shopping-link">
              <i className="fa fa-arrow-left"></i> Seguir comprando
            </Link>
            <button onClick={clearCart} className="clear-cart-btn">
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
                <form onSubmit={applyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="apply-coupon-btn">
                    Aplicar
                  </button>
                </form>
              )}
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
              <button className="checkout-btn">
                Proceder al pago <i className="fa fa-arrow-right"></i>
              </button>
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
    </div>
  );
};

export default Cart;