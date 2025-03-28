// src/Pages/Profile/Components/PasswordTab.jsx
import React, { useState } from 'react';

const PasswordTab = ({ updateProfile }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <div className="profile-tab password-tab">
      <div className="tab-header">
        <h2>Cambiar contraseña</h2>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <form onSubmit={handleChangePassword} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Contraseña actual</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            minLength="8"
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
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="change-password-btn">
            Cambiar contraseña
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;