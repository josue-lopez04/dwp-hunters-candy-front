// src/Pages/ResetPassword/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import authService from '../../services/auth.service';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    // Aquí podríamos verificar si el token es válido sin revelar información sensible
    if (!token) {
      setValidToken(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario escribe
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  // Si el token no es válido, mostrar error
  if (!validToken) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="error-state">
            <div className="error-icon">
              <i className="fa fa-exclamation-circle"></i>
            </div>
            <h2>Enlace inválido</h2>
            <p>El enlace para restablecer la contraseña no es válido o ha expirado.</p>
            <Link to="/forgot-password" className="try-again-btn">
              Solicitar un nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="logo">
          <img src="/logo.jpeg" alt="Logo de HC" />
        </div>
        
        <h1>Restablecer contraseña</h1>
        
        {success ? (
          <div className="success-message">
            <div className="success-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <h2>¡Contraseña restablecida!</h2>
            <p>Tu contraseña ha sido actualizada correctamente.</p>
            <Link to="/login" className="back-to-login-btn">
              Ir al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <p className="instruction-text">
              Ingresa tu nueva contraseña a continuación.
            </p>
            
            {error && (
              <div className="error-alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="password">Nueva contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu nueva contraseña"
                  minLength="8"
                  required
                />
                <p className="password-hint">La contraseña debe tener al menos 8 caracteres.</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Restablecer contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;