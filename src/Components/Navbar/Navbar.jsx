import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="main-nav">
      <button className="mobile-menu-button" onClick={toggleMenu}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      
      <ul className={`nav-list ${isOpen ? 'nav-active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/inventory" className="nav-link">Productos</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">Contacto</Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">Mi perfil</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;