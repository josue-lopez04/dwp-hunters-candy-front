import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import './CheckoutForm.css';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';

/**
 * CheckoutForm component for handling checkout process
 * 
 * @returns {JSX.Element} Checkout form component
 */
const CheckoutForm = ({ shippingAddress, onAddressChange, onSubmit, loading }) => {
  const { calculateSubtotal, calculateTotal, cartItems, couponCode, discountAmount } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario Demo'
  });
  const [errors, setErrors] = useState({});

  // Calculate shipping cost
  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 5000 ? 0 : 250;
  const taxAmount = subtotal * 0.16;
  const totalAmount = calculateTotal() + taxAmount + shippingCost;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate shipping address
    if (!shippingAddress.street) newErrors.street = 'La dirección es requerida';
    if (!shippingAddress.city) newErrors.city = 'La ciudad es requerida';
    if (!shippingAddress.state) newErrors.state = 'El estado es requerido';
    if (!shippingAddress.zipCode) newErrors.zipCode = 'El código postal es requerido';
    else if (!/^\d{5}$/.test(shippingAddress.zipCode)) 
      newErrors.zipCode = 'El código postal debe tener 5 dígitos';
    
    // Validate card details if payment method is card
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) newErrors.cardNumber = 'El número de tarjeta es requerido';
      if (!cardDetails.expiryDate.trim()) newErrors.expiryDate = 'La fecha de expiración es requerida';
      if (!cardDetails.cvv.trim()) newErrors.cvv = 'El CVV es requerido';
      if (!cardDetails.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Create order data
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: taxAmount,
      shippingPrice: shippingCost,
      discountAmount,
      totalPrice: totalAmount,
      couponCode: couponCode || ''
    };
    
    onSubmit(orderData);
  };

  return (
    <div className="checkout-form">
      <div className="checkout-form-content">
        <form onSubmit={handleSubmit}>
          <Card title="Dirección de envío" className="mb-4">
            <div className="form-group">
              <label htmlFor="street">Dirección *</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={onAddressChange}
                className={errors.street ? 'input-error' : ''}
              />
              {errors.street && <div className="error-message">{errors.street}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ciudad *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={onAddressChange}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <div className="error-message">{errors.city}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">Estado *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={onAddressChange}
                  className={errors.state ? 'input-error' : ''}
                />
                {errors.state && <div className="error-message">{errors.state}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Código Postal *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={onAddressChange}
                  className={errors.zipCode ? 'input-error' : ''}
                />
                {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="country">País</label>
                <select
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={onAddressChange}
                >
                  <option value="México">México</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Canadá">Canadá</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Método de pago" className="mb-4">
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
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={errors.cardNumber ? 'input-error' : ''}
                  />
                  {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                  <p className="field-note">Datos ficticios para demostración - no se validarán</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Fecha de Expiración</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/AA"
                      maxLength="5"
                      className={errors.expiryDate ? 'input-error' : ''}
                    />
                    {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="3"
                      className={errors.cvv ? 'input-error' : ''}
                    />
                    {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardName">Nombre en la Tarjeta</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardChange}
                    placeholder="Juan Pérez"
                    className={errors.cardName ? 'input-error' : ''}
                  />
                  {errors.cardName && <div className="error-message">{errors.cardName}</div>}
                </div>
              </div>
            )}
          </Card>

          <Card title="Resumen del pedido" className="mb-4">
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Descuento</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>IVA (16%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                {subtotal > 5000 ? (
                  <span className="free-shipping">Gratis</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="form-actions">
            <Button type="secondary" onClick={() => window.history.back()}>
              Volver al Carrito
            </Button>
            <Button type="primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Realizar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;