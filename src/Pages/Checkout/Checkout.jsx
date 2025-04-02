import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/order.service';
import Navbar from '../../Components/Navbar/Navbar';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, calculateSubtotal, calculateTotal, discountAmount, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [ setProcessingMessage] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México'
  });

  // Si no hay items en el carrito, redirigir a la página del carrito
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar dirección
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Por favor, completa todos los campos de la dirección de envío');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Preparar items para la orden
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id
      }));
      
      // Calcular precios
      const itemsPrice = calculateSubtotal();
      const taxPrice = itemsPrice * 0.16; // 16% IVA
      const shippingPrice = itemsPrice > 5000 ? 0 : 250; // Envío gratis para compras mayores a $5000
      const totalPrice = calculateTotal() + taxPrice + shippingPrice;
      
      // Crear objeto de orden
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        couponCode: couponCode || ''
      };
      
      console.log("Enviando orden:", orderData);
      
      // Mensaje de procesamiento
      setProcessingMessage('Procesando tu pedido...');
      
      // Enviar orden al servidor
      const createdOrder = await orderService.createOrder(orderData);
      console.log("Orden creada:", createdOrder);
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a la página de confirmación
      navigate(`/order-success/${createdOrder._id}`);
      
    } catch (err) {
      console.error("Error al crear la orden:", err);
      setError(err.message || 'Hubo un error al procesar tu orden. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1>Finalizar Compra</h1>
        
        {error && (
          <div className="error-alert">
            <i className="fa fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>Información de Envío</h2>
                
                <div className="form-group">
                  <label htmlFor="street">Dirección</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Ciudad</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Ciudad"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">Estado</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      placeholder="Estado"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">Código Postal</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      placeholder="Código Postal"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">País</label>
                    <select
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      required
                    >
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Canadá">Canadá</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Método de Pago</h2>
                
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <label htmlFor="card">
                      <i className="fa fa-credit-card"></i>
                      Tarjeta de Crédito/Débito
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    <label htmlFor="paypal">
                      <i className="fa fa-paypal"></i>
                      PayPal
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <label htmlFor="cash">
                      <i className="fa fa-money-bill"></i>
                      Pago contra entrega
                    </label>
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Número de Tarjeta (Ficticio)</label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        defaultValue="4242 4242 4242 4242"
                      />
                      <p className="field-note">Datos ficticios para demostración - no se validarán</p>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Fecha de Expiración</label>
                        <input
                          type="text"
                          id="expiryDate"
                          placeholder="MM/AA"
                          maxLength="5"
                          defaultValue="12/25"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          maxLength="3"
                          defaultValue="123"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        id="cardName"
                        placeholder="Juan Pérez"
                        defaultValue="Usuario Demo"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="checkout-actions">
                <button
                  type="button"
                  className="back-to-cart-btn"
                  onClick={() => navigate('/cart')}
                >
                  Volver al Carrito
                </button>
                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    'Realizar Pedido'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            
            <div className="order-items">
              <h3>Productos ({cartItems.length})</h3>
              
              <div className="order-items-list">
                {cartItems.map(item => (
                  <div key={item.id || item._id} className="order-item">
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-quantity">x{item.quantity}</span>
                    </div>
                    <div className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-totals">
              <div className="order-total-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="order-total-row discount">
                  <span>Descuento</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="order-total-row">
                <span>IVA (16%)</span>
                <span>${(calculateSubtotal() * 0.16).toFixed(2)}</span>
              </div>
              
              <div className="order-total-row">
                <span>Envío</span>
                {calculateSubtotal() > 5000 ? (
                  <span className="free-shipping">Gratis</span>
                ) : (
                  <span>$250.00</span>
                )}
              </div>
              
              <div className="order-total-row grand-total">
                <span>Total</span>
                <span>
                  ${(
                    calculateTotal() +
                    calculateSubtotal() * 0.16 +
                    (calculateSubtotal() > 5000 ? 0 : 250)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;