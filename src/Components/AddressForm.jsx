import React, { useState, useEffect } from 'react';
import './AddressForm.css';

const AddressForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: 'shipping',
    isDefault: false,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México'
  });
  
  const [errors, setErrors] = useState({});
  
  // Si se proporciona initialData (por ejemplo, al editar), cargar esos datos
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'shipping',
        isDefault: initialData.isDefault || false,
        street: initialData.street || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        country: initialData.country || 'México'
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.street.trim()) {
      newErrors.street = 'La dirección es requerida';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'El estado es requerido';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'El código postal debe tener 5 dígitos';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <div className="address-form-container">
      <h3>{initialData ? 'Editar Dirección' : 'Añadir Nueva Dirección'}</h3>
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Tipo de Dirección</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="shipping">Dirección de Envío</option>
              <option value="billing">Dirección de Facturación</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label htmlFor="isDefault">Establecer como dirección predeterminada</label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="street">Dirección*</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Calle, número, colonia"
            className={errors.street ? 'input-error' : ''}
          />
          {errors.street && <div className="error-message">{errors.street}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Ciudad*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ciudad"
              className={errors.city ? 'input-error' : ''}
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="state">Estado*</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Estado"
              className={errors.state ? 'input-error' : ''}
            />
            {errors.state && <div className="error-message">{errors.state}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">Código Postal*</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Código Postal"
              className={errors.zipCode ? 'input-error' : ''}
            />
            {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="country">País</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="México">México</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Canadá">Canadá</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="save-btn">
            {initialData ? 'Actualizar Dirección' : 'Guardar Dirección'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;