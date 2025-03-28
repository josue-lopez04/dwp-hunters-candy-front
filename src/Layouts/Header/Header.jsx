import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
          </Link>
        </div>
        <Navbar />
        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <i className="fa fa-shopping-cart"></i>
          </Link>
          <Link to="/profile" className="profile-icon">
            <i className="fa fa-user"></i>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;