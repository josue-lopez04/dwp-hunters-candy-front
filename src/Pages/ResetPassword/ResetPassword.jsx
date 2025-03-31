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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: 'Muy débil',
    color: '#ef4444'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Verificar token al cargar
  useEffect(() => {
    if (!token) {
      setValidToken(false);
    }
    // También podríamos verificar el token con el backend aquí
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Evaluar fuerza de la contraseña si el campo es password
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Limpiar error cuando el usuario escribe
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (password) => {
    // Criterios de evaluación
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    
    // Calcular puntuación (0-4)
    let score = 0;
    if (hasLowerCase) score++;
    if (hasUpperCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    if (hasMinLength) score++;
    
    // Determinar mensaje y color basado en puntuación
    let message = '';
    let color = '';
    
    switch(true) {
      case (score === 0 || score === 1):
        message = 'Muy débil';
        color = '#ef4444'; // Rojo
        break;
      case (score === 2):
        message = 'Débil';
        color = '#f59e0b'; // Naranja
        break;
      case (score === 3):
        message = 'Media';
        color = '#fbbf24'; // Amarillo
        break;
      case (score === 4):
        message = 'Fuerte';
        color = '#22c55e'; // Verde
        break;
      case (score === 5):
        message = 'Muy fuerte';
        color = '#16a34a'; // Verde oscuro
        break;
      default:
        message = 'Muy débil';
        color = '#ef4444';
    }
    
    setPasswordStrength({ score, message, color });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError('Por favor, elige una contraseña más segura');
      return;
    }
    
    try {
      setLoading(true);
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Token inválido o expirado. Por favor, solicita un nuevo enlace de restablecimiento.');
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
              Crea una nueva contraseña segura para tu cuenta.
            </p>
            
            {error && (
              <div className="error-alert">
                <i className="fa fa-exclamation-circle"></i> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="password">Nueva contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu nueva contraseña"
                    minLength="8"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar-container">
                      <div 
                        className="strength-bar" 
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.message}
                    </span>
                  </div>
                )}
                
                <p className="password-hint">
                  Tu contraseña debe tener al menos 8 caracteres e incluir letras mayúsculas, minúsculas, números y caracteres especiales.
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu nueva contraseña"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Procesando...
                  </>
                ) : (
                  'Restablecer contraseña'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;