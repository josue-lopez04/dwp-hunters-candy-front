import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import './MFASetup.css';

/**
 * Componente para configurar la autenticación de dos factores (MFA)
 * Ubicación: /src/Components/MFASetup/MFASetup.jsx
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSetupComplete - Función a ejecutar cuando la configuración es exitosa
 * @returns {JSX.Element} Componente de configuración MFA
 */
const MFASetup = ({ onSetupComplete }) => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { setupMFA, verifyAndEnableMFA } = useAuth();

  // Generar código QR y secreto al cargar el componente
  useEffect(() => {
    const generateMFA = async () => {
      try {
        setLoading(true);
        setError(''); // Limpiar errores anteriores
        
        const response = await setupMFA();
        
        if (!response || !response.qrCodeUrl || !response.secret) {
          throw new Error('Error al obtener los datos MFA del servidor');
        }
        
        setQrCode(response.qrCodeUrl);
        setSecret(response.secret);
      } catch (err) {
        console.error('Error al generar MFA:', err);
        setError('Error al generar el código QR. Por favor intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    generateMFA();
  }, [setupMFA]);

  const handleRetryQRCode = async () => {
    // Intentar generar el código QR nuevamente
    try {
      setLoading(true);
      setError('');
      
      const response = await setupMFA();
      setQrCode(response.qrCodeUrl);
      setSecret(response.secret);
      
      setLoading(false);
    } catch (err) {
      setError('Error al regenerar el código QR. Intente de nuevo.');
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor ingrese el código de verificación');
      return;
    }
    
    try {
      setVerifying(true);
      setError(''); // Limpiar errores anteriores
      
      await verifyAndEnableMFA(token);
      
      if (onSetupComplete) onSetupComplete();
    } catch (err) {
      console.error('Error al verificar MFA:', err);
      setError(err.message || 'Código inválido. Intente de nuevo.');
    } finally {
      setVerifying(false);
    }
  };

  const handleTokenChange = (e) => {
    // Solo permitir dígitos y limitar a 6 caracteres
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
    
    // Limpiar mensaje de error cuando el usuario comienza a escribir
    if (error) setError('');
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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
      
      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
      </div>
      
      {error && (
        <div className="mfa-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          {currentStep === 2 && (
            <button onClick={handleRetryQRCode} className="retry-btn">
              Reintentar
            </button>
          )}
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="setup-step">
          <h3>1. Instala una aplicación autenticadora</h3>
          <p className="instruction-text">
            Descarga e instala una de estas aplicaciones en tu dispositivo móvil:
          </p>
          
          <div className="authenticator-apps">
            <div className="authenticator-app">
              <i className="fab fa-google"></i>
              <span>Google Authenticator</span>
            </div>
            <div className="authenticator-app">
              <i className="fab fa-microsoft"></i>
              <span>Microsoft Authenticator</span>
            </div>
            <div className="authenticator-app">
              <i className="fas fa-shield-alt"></i>
              <span>Authy</span>
            </div>
          </div>
          
          <div className="step-actions">
            <button className="next-button" onClick={nextStep}>
              Continuar <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="setup-step">
          <h3>2. Escanea el código QR</h3>
          <p className="instruction-text">
            Abre la aplicación autenticadora y escanea el siguiente código QR:
          </p>
          
          <div className="qr-code-container">
            {qrCode ? (
              <img src={qrCode} alt="Código QR para configuración MFA" />
            ) : (
              <div className="qr-error">
                <p>Error al cargar el código QR</p>
                <button onClick={handleRetryQRCode} className="retry-btn">
                  Reintentar
                </button>
              </div>
            )}
          </div>
          
          <div className="manual-entry">
            <h4>¿No puedes escanear el código?</h4>
            <p>Ingresa este código manualmente en tu aplicación:</p>
            <div className="secret-key">
              {secret ? secret : 'Error al cargar el código secreto'}
              {secret && (
                <button 
                  className="copy-secret-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(secret);
                    alert('Código copiado al portapapeles');
                  }}
                >
                  <i className="fas fa-copy"></i>
                </button>
              )}
            </div>
          </div>
          
          <div className="step-actions">
            <button className="back-button" onClick={prevStep}>
              <i className="fas fa-arrow-left"></i> Atrás
            </button>
            <button className="next-button" onClick={nextStep}>
              Continuar <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="setup-step">
          <h3>3. Ingresa el código de verificación</h3>
          <p className="instruction-text">
            Ingresa el código de 6 dígitos que aparece en tu aplicación autenticadora:
          </p>
          
          <form onSubmit={handleVerify} className="verify-form">
            <div className="form-group">
              <input
                type="text"
                value={token}
                onChange={handleTokenChange}
                placeholder="000000"
                maxLength="6"
                autoFocus
                className="verification-input"
              />
              <p className="field-hint">Este paso verifica que has configurado correctamente la autenticación de dos factores</p>
              <p className="field-hint">
                Nota importante: si ves el mensaje "Código inválido. Inténtalo de nuevo." y ya lo has intentado varias veces, 
                prueba borrando la cuenta en tu aplicación de autenticación y escanea el código nuevamente.
              </p>
            </div>
            
            <div className="step-actions">
              <button className="back-button" onClick={prevStep}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
              <button 
                type="submit" 
                className="verify-button"
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <span className="spinner-small"></span>
                    Verificando...
                  </>
                ) : 'Verificar y activar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MFASetup;