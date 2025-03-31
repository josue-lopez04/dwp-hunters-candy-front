import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/order.service';
import OrderCard from './Components/OrderCard';
import PersonalInfo from './Components/PersonalInfo';
import SecurityTab from './Components/SecurityTab';
import PasswordTab from './Components/PasswordTab';
import OrdersTab from './Components/OrdersTab';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { user, updateProfile, setupMFA, verifyAndEnableMFA, disableMFA } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulamos tener direcciones guardadas
      setAddresses([
        {
          id: 1,
          type: 'shipping',
          isDefault: true,
          street: 'Av. Constitución 1500',
          city: 'Querétaro',
          state: 'Querétaro',
          zipCode: '76000',
          country: 'México'
        },
        {
          id: 2,
          type: 'billing',
          isDefault: true,
          street: 'Calle Hidalgo 245',
          city: 'Querétaro',
          state: 'Querétaro',
          zipCode: '76020',
          country: 'México'
        }
      ]);

      setLoading(false);
    }
  }, [user]);

  // Cargar órdenes cuando se active la pestaña de órdenes
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
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
          // Si hay un error, mostrar algunas órdenes de ejemplo
          setOrders([
            // Órdenes de ejemplo (mismo código que antes)
          ]);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchOrders();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-not-found">
        <h2>Usuario no encontrado</h2>
        <p>No se pudo cargar la información del perfil.</p>
        <Link to="/" className="go-home-btn">
          Ir al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user.avatar || 'profile.webp'} alt={`${user.firstName} ${user.lastName}`} />
          </div>
          <div className="profile-title">
            <h1>{user.firstName} {user.lastName}</h1>
            <p>Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'hace tiempo'}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-menu">
              <button
                className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <i className="fa fa-user"></i>
                Información personal
              </button>
              <button
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fa fa-shopping-bag"></i>
                Mis pedidos
              </button>
              <button
                className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="fa fa-map-marker"></i>
                Direcciones
              </button>
              <button
                className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="fa fa-shield-alt"></i>
                Seguridad
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === 'info' && (
              <PersonalInfo user={user} updateProfile={updateProfile} />
            )}

            {activeTab === 'orders' && (
              <div className="profile-tab orders-tab">
                <div className="tab-header">
                  <h2>Mis pedidos</h2>
                </div>

                {ordersLoading ? (
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
            )}

            {activeTab === 'addresses' && (
              <div className="profile-tab addresses-tab">
                <div className="tab-header">
                  <h2>Mis direcciones</h2>

                </div>

                {addresses.length === 0 ? (
                  <div className="empty-state">
                    <i className="fa fa-map-marker"></i>
                  </div>
                ) : (
                  <div className="addresses-list">
                    {addresses.map(address => (
                      <div key={address.id} className="address-card">
                        <div className="address-header">
                          <div className="address-type">
                            {address.type === 'shipping' ? 'Dirección de envío' : 'Dirección de facturación'}
                            {address.isDefault && <span className="default-badge">Predeterminada</span>}
                          </div>
                          <div className="address-actions">
                            <button className="edit-address-btn">
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button className="delete-address-btn">
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="address-body">
                          <p className="address-line">{address.street}</p>
                          <p className="address-line">{address.city}, {address.state} {address.zipCode}</p>
                          <p className="address-line">{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <SecurityTab
                user={user}
                setupMFA={setupMFA}
                verifyAndEnableMFA={verifyAndEnableMFA}
                disableMFA={disableMFA}
              />
            )}

            {activeTab === 'password' && (
              <PasswordTab updateProfile={updateProfile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;