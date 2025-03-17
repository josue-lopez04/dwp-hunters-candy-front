import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Navbar from '../../Components/Navbar/Navbar';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  useEffect(() => {
    setTimeout(() => {
      const mockUser = {
        id: 1,
        firstName: 'josue',
        lastName: 'lopez',
        email: 'josue@gamail.com',
        phone: '555-123-4567',
        avatar: '/images/profile-avatar.jpg',
        createdAt: '2024-01-15'
      };

      const mockOrders = [
        {
          id: 'ORD-10001',
          date: '2025-02-20',
          total: 15799.97,
          status: 'Entregado',
          items: 3
        },
        {
          id: 'ORD-10002',
          date: '2025-01-12',
          total: 2499.99,
          status: 'Enviado',
          items: 1
        },
        {
          id: 'ORD-10003',
          date: '2024-12-05',
          total: 8599.98,
          status: 'Procesado',
          items: 2
        }
      ];

      const mockAddresses = [
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
      ];

      setUser(mockUser);
      setOrders(mockOrders);
      setAddresses(mockAddresses);
      setFormData({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phone: mockUser.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditMode(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', formData);

    setUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    });

    setEditMode(false);
    alert('Perfil actualizado correctamente');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Cambio de contraseña:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    alert('Contraseña actualizada correctamente');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Entregado':
        return 'status-delivered';
      case 'Enviado':
        return 'status-shipped';
      case 'Procesado':
        return 'status-processing';
      default:
        return '';
    }
  };

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
            <img src={user.avatar || 'https://via.placeholder.com/100'} alt={`${user.firstName} ${user.lastName}`} />
          </div>
          <div className="profile-title">
            <h1>{user.firstName} {user.lastName}</h1>
            <p>Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
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
                className={`menu-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <i className="fa fa-lock"></i>
                Cambiar contraseña
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === 'info' && (
              <div className="profile-tab info-tab">
                <div className="tab-header">
                  <h2>Información personal</h2>
                  {!editMode && (
                    <button onClick={handleEditProfile} className="edit-btn">
                      <i className="fa fa-pencil"></i> Editar
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleSaveProfile} className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Correo electrónico</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn">
                        Guardar cambios
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <div className="info-label">Nombre completo</div>
                      <div className="info-value">{user.firstName} {user.lastName}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Correo electrónico</div>
                      <div className="info-value">{user.email}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Teléfono</div>
                      <div className="info-value">{user.phone || 'No especificado'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="profile-tab orders-tab">
                <div className="tab-header">
                  <h2>Mis pedidos</h2>
                </div>

                {orders.length === 0 ? (
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
                      <div key={order.id} className="order-card">
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
                            <button className="view-order-btn">
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="profile-tab addresses-tab">
                <div className="tab-header">
                  <h2>Mis direcciones</h2>
                  <button className="add-btn">
                    <i className="fa fa-plus"></i> Añadir nueva
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="empty-state">
                    <i className="fa fa-map-marker"></i>
                    <p>No has añadido ninguna dirección todavía.</p>
                    <button className="add-address-btn">
                      Añadir dirección
                    </button>
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

            {activeTab === 'password' && (
              <div className="profile-tab password-tab">
                <div className="tab-header">
                  <h2>Cambiar contraseña</h2>
                </div>

                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Contraseña actual</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva contraseña</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      minLength="8"
                    />
                    <p className="password-hint">La contraseña debe tener al menos 8 caracteres.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="change-password-btn">
                      Cambiar contraseña
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;