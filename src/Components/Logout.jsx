import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Cerrar sesión
    logout();
    
    // Redirigir al login
    navigate('/login');
  }, [navigate, logout]);

  return (
    <div className="logout-page">
      <div className="logout-container">
        <h1>Cerrando sesión...</h1>
        <p>Redirigiendo al inicio de sesión.</p>
      </div>
    </div>
  );
};

export default Logout;