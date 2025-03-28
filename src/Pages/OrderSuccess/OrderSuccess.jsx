import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './OrderSuccess.css';
import orderService from '../../services/order.service';
import Navbar from '../../Components/Navbar/Navbar';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        // Intentar obtener los detalles de la orden si tenemos un ID real
        if (orderId && orderId !== 'undefined') {
          const orderData = await orderService.getOrderById(orderId);
          setOrder(orderData);
        } else {
          // Si no tenemos un ID real, usar datos simulados
          setOrder({
            _id: 'ORD-12345',
            createdAt: new Date().toISOString(),
            totalPrice: 10000,
            shippingAddress: {
              street: 'Av. Principal 123',
              city: 'Querétaro',
              state: 'Querétaro',
              zipCode: '76000',
              country: 'México'
            },
            isPaid: false,
            paidAt: null,
            status: 'Procesado',
            paymentMethod: 'card'
          });
        }
      } catch (err) {
        console.error(err);
        setError('No pudimos obtener los detalles de tu pedido. Por favor contacta a atención al cliente.');
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-success-loading">
        <div className="spinner-border"></div>
        <p>Cargando información del pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-error">
        <i className="fa fa-exclamation-circle"></i>
        <h2>Algo salió mal</h2>
        <p>{error}</p>
        <Link to="/" className="btn-home">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <Navbar />
      <div className="order-success-container">
        <div className="order-success-header">
          <div className="success-icon">
            <i className="fa fa-check-circle"></i>
          </div>
          <h1>¡Gracias por tu compra!</h1>
          <p>Tu pedido ha sido procesado correctamente</p>
        </div>

        <div className="order-details-card">
          <div className="order-details-header">
            <div className="order-number">
              <span>Número de Pedido:</span>
              <strong>{order._id}</strong>
            </div>
            <div className="order-date">
              <span>Fecha de Pedido:</span>
              <strong>{new Date(order.createdAt).toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong>
            </div>
          </div>

          <div className="order-status-section">
            <div className="order-status-item">
              <span className="status-label">Estado del Pedido:</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="order-status-item">
              <span className="status-label">Estado del Pago:</span>
              <span className={`status-badge ${order.isPaid ? 'pagado' : 'pendiente'}`}>
                {order.isPaid ? 'Pagado' : 'Pendiente'}
              </span>
            </div>
            <div className="order-status-item">
              <span className="status-label">Método de Pago:</span>
              <span className="payment-method">
                {order.paymentMethod === 'card' && <i className="fa fa-credit-card"></i>}
                {order.paymentMethod === 'paypal' && <i className="fa fa-paypal"></i>}
                {order.paymentMethod === 'cash' && <i className="fa fa-money-bill"></i>}
                {order.paymentMethod === 'card' && 'Tarjeta de Crédito/Débito'}
                {order.paymentMethod === 'paypal' && 'PayPal'}
                {order.paymentMethod === 'cash' && 'Pago contra entrega'}
              </span>
            </div>
          </div>

          <div className="order-info-section">
            <div className="shipping-info">
              <h3>Dirección de Envío</h3>
              <address>
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>
            
            <div className="order-summary">
              <h3>Resumen del Pedido</h3>
              <div className="order-amount">
                <span>Total:</span>
                <strong>${order.totalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="order-message">
            <p>Te hemos enviado un correo electrónico con los detalles de tu compra a <strong>{order.user?.email || 'tu correo registrado'}</strong>.</p>
            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos a través de nuestro <Link to="/contact">formulario de contacto</Link>.</p>
          </div>

          <div className="estimated-delivery">
            <h3>Tiempo Estimado de Entrega</h3>
            <p>Tu pedido será entregado en aproximadamente <strong>3-5 días hábiles</strong>.</p>
            <div className="delivery-progress">
              <div className="progress-step active">
                <div className="step-icon"><i className="fa fa-check"></i></div>
                <div className="step-label">Procesado</div>
              </div>
              <div className="progress-bar"></div>
              <div className="progress-step">
                <div className="step-icon"><i className="fa fa-box"></i></div>
                <div className="step-label">Empacado</div>
              </div>
              <div className="progress-bar"></div>
              <div className="progress-step">
                <div className="step-icon"><i className="fa fa-shipping-fast"></i></div>
                <div className="step-label">Enviado</div>
              </div>
              <div className="progress-bar"></div>
              <div className="progress-step">
                <div className="step-icon"><i className="fa fa-home"></i></div>
                <div className="step-label">Entregado</div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-success-actions">
          <Link to="/profile" className="btn-view-orders">
            Ver mis pedidos
          </Link>
          <Link to="/inventory" className="btn-continue-shopping">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;