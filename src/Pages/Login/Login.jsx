import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGuestLogin();
  };

  const handleGuestLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');

    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="register-logo">
          <img src="/logo.jpeg" alt="Logo de HC" />
        </div>
        <div className="login-header">
          <h1>Hola bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Introduce correo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Introduce contraseña</label>
            <div className="password-input-container">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">¿No puedes acceder?</Link>
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="guest-login-button"
          >
            Entrar como invitado
          </button>

          <div className="register-link">
            <span>¿Aún no tienes cuenta?</span>
            <Link to="/register">Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;