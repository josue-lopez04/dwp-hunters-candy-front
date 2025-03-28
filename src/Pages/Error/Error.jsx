import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';

const Error = () => {
  return (
    <div className="error-page">
      <Navbar />
      <div className="error-container">
        <div className="error-icon">
          <i className="fa fa-exclamation-triangle"></i>
        </div>
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <Link to="/" className="return-home-btn">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Error;