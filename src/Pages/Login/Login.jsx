import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import useAuth from '../../hooks/useAuth';
import MFAVerify from '../../Components/MFAVerify/MFAVerify';

/**
 * Componente de Login
 * Ubicación: /src/Pages/Login/Login.jsx
 * 
 * @returns {JSX.Element} Componente de login
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, requireMFA } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar mensaje de error cuando el usuario comienza a escribir
    if (error) setError('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.username || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      const result = await login(formData.username, formData.password);
      
      // Si no requiere MFA, redireccionar
      if (!result.requireMFA) {
        navigate('/');
      }
      // Si requiere MFA, el estado requireMFA en el contexto de autenticación
      // será actualizado y renderizará el componente MFAVerify
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerified = () => {
    navigate('/');
  };

  // Si se requiere MFA, mostrar pantalla de verificación
  if (requireMFA) {
    return (
      <div className="login-page">
        <div className="login-container">
        <img src="/logo.jpeg" alt="Logo de HC" className="logo-img" />

          <MFAVerify onVerified={handleMFAVerified} />
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="/logo.jpeg" alt="Logo de HC" />
        </div>
        <div className="login-header">
          <h1>Hola bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Introduce tu nombre de usuario"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Introduce contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={toggleShowPassword}
                tabIndex="-1"
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">¿No puedes acceder?</Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Iniciando sesión...</span>
              </>
            ) : 'Entrar'}
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