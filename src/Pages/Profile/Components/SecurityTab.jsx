// src/Pages/Profile/Components/SecurityTab.jsx
import React, { useState } from 'react';
import MFASetup from '../../../Components/MFASetup/MFASetup';
import { useAuth } from '../../../context/AuthContext';
import './SecurityTab.css';

const SecurityTab = ({ user }) => {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  const [disableMFAData, setDisableMFAData] = useState({
    token: '',
    password: ''
  });
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { disableMFA } = useAuth();

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setMfaEnabled(true);
    alert('Autenticación de dos factores activada correctamente.');
  };

  const handleDisableMFAChange = (e) => {
    const { name, value } = e.target;
    setDisableMFAData({
      ...disableMFAData,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario escribe
    if (error) setError('');
  };

  const handleSubmitDisableMFA = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!disableMFAData.token || !disableMFAData.password) {
      setError('Por favor ingrese tanto el código como la contraseña');
      return;
    }
    
    try {
      setLoading(true);
      await disableMFA(disableMFAData.token, disableMFAData.password);
      setMfaEnabled(false);
      setShowDisableForm(false);
      setDisableMFAData({ token: '', password: '' });
      alert('Autenticación de dos factores desactivada correctamente.');
    } catch (error) {
      setError(error.message || 'Error al desactivar la autenticación de dos factores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-tab security-tab">
      <div className="tab-header">
        <h2>Seguridad</h2>
      </div>
      
      {showMFASetup ? (
        <MFASetup onSetupComplete={handleMFASetupComplete} />
      ) : (
        <div className="security-settings">
          <div className="security-section">
            <h3>Autenticación de dos factores</h3>
            <p className="security-description">
              La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta.
              Además de tu contraseña, necesitarás ingresar un código temporal generado por una aplicación autenticadora.
            </p>
            
            <div className="mfa-status">
              <span className={`status-indicator ${mfaEnabled ? 'enabled' : 'disabled'}`}>
                {mfaEnabled ? 'Activado' : 'Desactivado'}
              </span>
              
              {!mfaEnabled ? (
                <button 
                  className="enable-mfa-btn"
                  onClick={() => setShowMFASetup(true)}
                >
                  Activar autenticación de dos factores
                </button>
              ) : (
                <button 
                  className="disable-mfa-btn"
                  onClick={() => setShowDisableForm(true)}
                >
                  Desactivar
                </button>
              )}
            </div>
            
            {/* Formulario para desactivar 2FA */}
            {showDisableForm && (
              <div className="disable-mfa-form-container">
                <h4>Desactivar autenticación de dos factores</h4>
                
                {error && <div className="mfa-error">{error}</div>}
                
                <form onSubmit={handleSubmitDisableMFA} className="disable-mfa-form">
                  <div className="form-group">
                    <label htmlFor="token">Código de verificación</label>
                    <input
                      type="text"
                      id="token"
                      name="token"
                      value={disableMFAData.token}
                      onChange={handleDisableMFAChange}
                      placeholder="Ingrese el código de 6 dígitos"
                      maxLength="6"
                    />
                    <p className="field-hint">Ingrese el código de su aplicación autenticadora</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={disableMFAData.password}
                      onChange={handleDisableMFAChange}
                      placeholder="Ingrese su contraseña"
                    />
                    <p className="field-hint">Confirme su contraseña para desactivar 2FA</p>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowDisableForm(false);
                        setDisableMFAData({ token: '', password: '' });
                        setError('');
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Confirmar desactivación'}
                    </button>
                  </div>
                </form>
                
                <div className="help-text">
                  <p>Nota: Si no puede acceder a su aplicación autenticadora, por favor contacte a soporte.</p>
                  <p className="alt-option">
                    Si no puedes completar este proceso, <strong>borra tu cuenta de la aplicación y vuelve a registrarte</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="security-section">
            <h3>Dispositivos conectados</h3>
            <p className="security-description">
              Gestiona tus dispositivos conectados. Puedes revisar aquí los dispositivos desde los que has iniciado sesión.
            </p>
            
            <div className="devices-list">
              <div className="device-item current">
                <div className="device-info">
                  <div className="device-icon">
                    <i className="fa fa-laptop"></i>
                  </div>
                  <div>
                    <h4>Dispositivo actual</h4>
                    <p>Navegador: {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                                    navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                                    navigator.userAgent.includes('Safari') ? 'Safari' : 'Desconocido'}</p>
                    <p>Sistema: {navigator.platform}</p>
                  </div>
                </div>
                <span className="device-status active">Activo ahora</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityTab;