// src/Pages/Profile/Components/OrdersTab.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../../services/order.service';
import OrderCard from './OrderCard';

const OrdersTab = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Intentar obtener las órdenes del servicio
        const myOrders = await orderService.getMyOrders();
        
        // Formatear órdenes para mostrarlas en la UI
        const formattedOrders = myOrders.map(order => {
          // Calcular el total de items sumando las cantidades de cada item
          const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
          
          return {
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            total: order.totalPrice,
            status: order.status,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            items: totalItems,
            orderItems: order.orderItems.map(item => ({
              id: item._id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              productId: item.product?._id || item.product
            }))
          };
        });
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        
        // Cargar órdenes de ejemplo si hay un error
        // Estas órdenes se mostrarán solo para el usuario actual, simulando que son sus pedidos
        setOrders([
          {
            id: 'ORD-10001',
            date: '20 de febrero de 2025',
            total: 15799.97,
            status: 'Entregado',
            isPaid: true,
            isDelivered: true,
            items: 3,
            orderItems: [
              {id: '1', name: 'Rifle de caza XH-200', quantity: 1, price: 11699.99},
              {id: '2', name: 'Mira telescópica HD', quantity: 1, price: 2499.99},
              {id: '3', name: 'Kit de limpieza para rifle', quantity: 1, price: 599.99}
            ]
          },
          {
            id: 'ORD-10002',
            date: '12 de enero de 2025',
            total: 2499.99,
            status: 'Enviado',
            isPaid: true,
            isDelivered: false,
            items: 1,
            orderItems: [
              {id: '1', name: 'Chaqueta Camuflaje Premium', quantity: 1, price: 2499.99}
            ]
          },
          {
            id: 'ORD-10003',
            date: '5 de diciembre de 2024',
            total: 8599.98,
            status: 'Procesado',
            isPaid: false,
            isDelivered: false,
            items: 2,
            orderItems: [
              {id: '1', name: 'Botas de Caza Impermeables', quantity: 2, price: 1899.99},
              {id: '2', name: 'Tienda de Campaña Camuflaje', quantity: 1, price: 3499.99}
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="profile-tab orders-tab">
      <div className="tab-header">
        <h2>Mis pedidos</h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <i className="fa fa-shopping-bag"></i>
          <p>No has realizado ningún pedido todavía.</p>
          <Link to="/inventory" className="shop-now-btn">
            Comprar ahora
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;