import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './MFAVerify.css';

const MFAVerify = ({ onVerified }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { validateMFA } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor ingrese el código de verificación');
      return;
    }
    
    try {
      setLoading(true);
      await validateMFA(token);
      if (onVerified) onVerified();
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => {
              setToken(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="000000"
            maxLength="6"
            autoFocus
          />
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