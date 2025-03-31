import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import './MFAVerify.css';

/**
 * Componente para verificación MFA durante el inicio de sesión
 * Ubicación: /src/Components/MFAVerify/MFAVerify.jsx
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onVerified - Función a ejecutar cuando la verificación es exitosa
 * @returns {JSX.Element} Componente de verificación MFA
 */
const MFAVerify = ({ onVerified }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { validateMFA, mfaUsername } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor ingrese el código de verificación');
      return;
    }
    
    try {
      setLoading(true);
      
      // Asegurarse de pasar tanto el username como el token
      await validateMFA(mfaUsername, token);
      
      if (onVerified) onVerified();
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    // Solo permitir dígitos y limitar a 6 caracteres
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
    
    // Limpiar mensaje de error cuando el usuario comienza a escribir
    if (error) setError('');
  };

  return (
    <div className="mfa-verify-container">
      <h2>Verificación de dos factores</h2>
      <p>Ingresa el código de verificación de tu aplicación autenticadora.</p>
      
      {error && <div className="mfa-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mfa-form">
        <div className="form-group">
          <label htmlFor="token">Código</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={handleTokenChange}
            placeholder="000000"
            maxLength="6"
            autoFocus
          />
          <p className="field-hint">Ingresa el código de 6 dígitos de tu aplicación autenticadora</p>
        </div>
        
        <button 
          type="submit" 
          className="verify-button"
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
      
      <div className="mfa-help">
        <p>¿No puedes acceder a tu código?</p>
        <p>Contacta a soporte para recibir ayuda.</p>
      </div>
    </div>
  );
};

export default MFAVerify;