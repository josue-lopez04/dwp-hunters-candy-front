import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext'; // Import correcto
import { useCart } from '../../context/CartContext';
import Notifications from '../Notifications/Notifications';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { cartItems } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener el total de items en el carrito
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="main-nav">
      <button className="mobile-menu-button" onClick={toggleMenu}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <ul className={`nav-list ${isOpen ? 'nav-active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            <i className="fa fa-home"></i> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/inventory" className="nav-link" onClick={() => setIsOpen(false)}>
            <i className="fa fa-box"></i> Productos
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>
            <i className="fa fa-envelope"></i> Contacto
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
            <i className="fa fa-user"></i> 
            {user ? `${user.firstName || user.username}` : 'Mi perfil'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)}>
            <i className="fa fa-shopping-cart"></i> Carrito
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </li>
        <li className="nav-item">
          <Notifications />
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link logout-button">
            <i className="fa fa-sign-out-alt"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;