import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Entregado':
        return 'status-delivered';
      case 'Enviado':
        return 'status-shipped';
      case 'Procesado':
        return 'status-processing';
      case 'Cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  const getPaymentStatusClass = (isPaid) => {
    return isPaid ? 'status-paid' : 'status-pending';
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-id">
          <span className="label">Pedido:</span>
          <span className="value">{order.id}</span>
        </div>
        <div className="order-date">
          <span className="label">Fecha:</span>
          <span className="value">{order.date}</span>
        </div>
      </div>
      <div className="order-body">
        <div className="order-info">
          <div className="order-status">
            <span className="label">Estado:</span>
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="order-payment">
            <span className="label">Pago:</span>
            <span className={`status-badge ${getPaymentStatusClass(order.isPaid)}`}>
              {order.isPaid ? 'Pagado' : 'Pendiente'}
            </span>
          </div>
          <div className="order-items">
            <span className="label">Productos:</span>
            <span className="value">{order.items}</span>
          </div>
          <div className="order-total">
            <span className="label">Total:</span>
            <span className="value">${order.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="order-actions">
          <button 
            className="toggle-details-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
          <Link to={`/order-success/${order.id}`} className="view-order-btn">
            Ver pedido
          </Link>
        </div>
      </div>
      
      {expanded && (
        <div className="order-details">
          <h4>Productos en este pedido</h4>
          <div className="order-items-list">
            {order.orderItems && order.orderItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">
                      <i className="fa fa-box"></i>
                    </div>
                  )}
                </div>
                <div className="order-item-info">
                  <div className="order-item-name">
                    {item.productId ? (
                      <Link to={`/inventory/${item.productId}`}>{item.name}</Link>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </div>
                  <div className="order-item-details">
                    <span className="order-item-quantity">Cantidad: {item.quantity}</span>
                    <span className="order-item-price">Precio: ${item.price.toFixed(2)}</span>
                    <span className="order-item-subtotal">Subtotal: ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;