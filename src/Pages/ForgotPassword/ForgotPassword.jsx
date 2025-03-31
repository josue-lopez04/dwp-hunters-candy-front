import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import authService from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: formulario inicial, 2: confirmación enviada
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se ingresó un email
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Llamar al servicio de recuperación de contraseña
      const response = await authService.forgotPassword(email);
      
      setSuccessMessage('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
      setStep(2); // Avanzar al siguiente paso
    } catch (err) {
      setError(err.message || 'Error al enviar correo de recuperación. Por favor, inténtelo más tarde.');
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
        
        {step === 1 ? (
          <>
            <p className="instruction-text">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            
            {error && (
              <div className="error-alert">
                <i className="fa fa-exclamation-circle"></i> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(''); // Limpiar error al escribir
                  }}
                  placeholder="tucorreo@ejemplo.com"
                  disabled={loading}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Enviando...
                  </>
                ) : (
                  'Enviar instrucciones'
                )}
              </button>
            </form>
            
            <div className="back-link">
              <Link to="/login">Volver al inicio de sesión</Link>
            </div>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <h2>¡Correo enviado!</h2>
            <p>{successMessage}</p>
            <p>Si no recibes el correo en los próximos minutos, revisa tu carpeta de spam o solicita un nuevo enlace.</p>
            
            <div className="email-info">
              <div className="email-sent-to">
                <span className="label">Correo enviado a:</span>
                <span className="value">{email}</span>
              </div>
            </div>
            
            <button 
              className="resend-btn"
              onClick={() => setStep(1)}
            >
              <i className="fa fa-envelope"></i> Solicitar nuevo enlace
            </button>
            
            <Link to="/login" className="back-to-login-btn">
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;