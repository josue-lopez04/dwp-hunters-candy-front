import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './MFASetup.css';

const MFASetup = ({ onSetupComplete }) => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { setupMFA, verifyAndEnableMFA } = useAuth();

  useEffect(() => {
    const generateMFA = async () => {
      try {
        setLoading(true);
        const response = await setupMFA();
        setQrCode(response.qrCodeUrl);
        setSecret(response.secret);
      } catch (err) {
        setError('Error al generar el código QR. Intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    generateMFA();
  }, [setupMFA]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor ingrese el código de verificación');
      return;
    }
    
    try {
      setVerifying(true);
      await verifyAndEnableMFA(token);
      if (onSetupComplete) onSetupComplete();
    } catch (err) {
      setError(err.message || 'Código inválido. Intente de nuevo.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="mfa-setup-loading">
        <div className="spinner"></div>
        <p>Generando código QR...</p>
      </div>
    );
  }

  return (
    <div className="mfa-setup-container">
      <h2>Configurar autenticación de dos factores</h2>
      
      <div className="mfa-setup-steps">
        <div className="setup-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Instala una aplicación autenticadora</h3>
            <p>Descarga e instala Google Authenticator, Microsoft Authenticator o Authy en tu dispositivo móvil.</p>
          </div>
        </div>
        
        <div className="setup-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Escanea el código QR</h3>
            <p>Abre la aplicación autenticadora y escanea el siguiente código QR:</p>
            
            <div className="qr-code-container">
              {qrCode ? (
                <img src={qrCode} alt="Código QR para configuración MFA" />
              ) : (
                <div className="qr-error">Error al cargar el código QR</div>
              )}
            </div>
            
            <div className="manual-entry">
              <h4>¿No puedes escanear el código?</h4>
              <p>Ingresa este código manualmente en tu aplicación:</p>
              <div className="secret-key">{secret}</div>
            </div>
          </div>
        </div>
        
        <div className="setup-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Ingresa el código de verificación</h3>
            <p>Ingresa el código de 6 dígitos que aparece en tu aplicación autenticadora:</p>
            
            {error && <div className="mfa-error">{error}</div>}
            
            <form onSubmit={handleVerify} className="verify-form">
              <div className="form-group">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="000000"
                  maxLength="6"
                />
              </div>
              
              <button 
                type="submit" 
                className="verify-button"
                disabled={verifying}
              >
                {verifying ? 'Verificando...' : 'Verificar y activar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFASetup;    