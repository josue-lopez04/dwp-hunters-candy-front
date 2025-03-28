import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import authService from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al enviar correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="logo">
          <img src="/logo.jpeg" alt="Logo de HC" />
        </div>
        
        <h1>Recuperación de contraseña</h1>
        
        {success ? (
          <div className="success-message">
            <div className="success-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <h2>¡Correo enviado!</h2>
            <p>Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña a la dirección {email}.</p>
            <p>Si no recibes el correo en los próximos minutos, revisa tu carpeta de spam.</p>
            <Link to="/login" className="back-to-login-btn">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <p className="instruction-text">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            
            {error && (
              <div className="error-alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </form>
            
            <div className="back-link">
              <Link to="/login">Volver al inicio de sesión</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;