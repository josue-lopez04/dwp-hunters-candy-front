// src/Components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import './Footer.css';

const Footer = () => {
  const { addTestNotification } = useSocket();

  const handleSecretClick = () => {
    addTestNotification("¡Bienvenido a Hunter's Candy! Explora nuestros productos destacados.");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Hunter's Candy</h3>
          <p className="footer-description">
            Tu tienda especializada en productos para caza legal y actividades al aire libre.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              {/* Usar fontawesome CDN para los iconos */}
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Enlaces rápidos</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">Inicio</Link>
            </li>
            <li>
              <Link to="/inventory" className="footer-link">Productos</Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">Contacto</Link>
            </li>
            <li>
              <Link to="/profile" className="footer-link">Mi perfil</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <ul className="contact-info">
            <li className="contact-item">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <span> hello --- Av. Constitución 1500, Querétaro</span>
            </li>
            <li className="contact-item">
              <i className="fas fa-phone-alt contact-icon"></i>
              <span>+52 (442) 123-4567</span>
            </li>
            <li className="contact-item">
              <i className="fas fa-envelope contact-icon"></i>
              <span>info@hunterscandy.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom" onClick={handleSecretClick}>
        <p className="copyright">&copy; {currentYear} Hunter's Candy - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;