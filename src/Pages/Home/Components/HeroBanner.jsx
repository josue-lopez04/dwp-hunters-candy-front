import React from 'react';
import { Link } from 'react-router-dom';
import "./HeroBanner.css"


const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1>Bienvenido a Hunter's Candy</h1>
        <p>Descubre nuestra selección especializada de productos para caza legal y actividades al aire libre</p>
        <div className="hero-buttons">
          <Link to="/inventory" className="hero-button primary">
            Ver Productos
          </Link>
          <Link to="/contact" className="hero-button secondary">
            Contáctanos
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HeroBanner;