// src/Pages/Profile/Components/PersonalInfo.jsx
import React, { useState } from 'react';

const PersonalInfo = ({ user, updateProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setEditMode(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setEditMode(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el perfil: ' + error.message);
    }
  };

  return (
    <div className="profile-tab info-tab">
      <div className="tab-header">
        <h2>Información personal</h2>
        {!editMode && (
          <button onClick={handleEditProfile} className="edit-btn">
            <i className="fa fa-pencil"></i> Editar
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSaveProfile} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              Guardar cambios
            </button>
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">Nombre completo</div>
            <div className="info-value">{user.firstName} {user.lastName}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Correo electrónico</div>
            <div className="info-value">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;