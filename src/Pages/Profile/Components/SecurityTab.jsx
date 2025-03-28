// src/Pages/Profile/Components/SecurityTab.jsx
import React, { useState, useEffect } from 'react';
import MFASetup from '../../../Components/MFASetup/MFASetup';
import './SecurityTab.css';
const SecurityTab = ({ user, setupMFA, verifyAndEnableMFA, disableMFA }) => {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  
  // Actualizar el estado local cuando cambie user.mfaEnabled
  useEffect(() => {
    setMfaEnabled(user?.mfaEnabled || false);
  }, [user]);

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setMfaEnabled(true);
    alert('Autenticación de dos factores activada correctamente.');
  };

  const handleDisableMFA = async () => {
    if (window.confirm('¿Estás seguro de que deseas desactivar la autenticación de dos factores? Esto reducirá la seguridad de tu cuenta.')) {
      try {
        await disableMFA();
        setMfaEnabled(false);
        alert('Autenticación de dos factores desactivada correctamente.');
      } catch (error) {
        alert('Error al desactivar la autenticación de dos factores: ' + error.message);
      }
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
                  onClick={handleDisableMFA}
                >
                  Desactivar
                </button>
              )}
            </div>
          </div>
          
          <div className="security-section">
            <h3>Sesiones activas</h3>
            <p className="security-description">
              Gestiona tus sesiones activas. Puedes cerrar sesión en todos los dispositivos excepto en el actual.
            </p>
            
            <button className="logout-all-btn">
              Cerrar todas las sesiones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityTab;