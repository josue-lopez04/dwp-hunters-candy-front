import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <button className="mobile-menu-button" onClick={toggleMenu}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <ul className={`nav-list ${isOpen ? 'nav-active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="fa fa-home"></i> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/inventory" className="nav-link">
            <i className="fa fa-box"></i> Productos
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">
            <i className="fa fa-envelope"></i> Contacto
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            <i className="fa fa-user"></i> Mi perfil
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cart" className="nav-link">
            <i className="fa fa-shopping-cart"></i> Carrito
          </Link>
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
