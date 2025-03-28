import React, { useState, useEffect } from 'react';
import './Contact.css';
import Navbar from '../../Components/Navbar/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Cargar Font Awesome para los iconos
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newValidation = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    if (!formData.name.trim()) {
      newValidation.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newValidation.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newValidation.email = 'Ingresa un correo electrónico válido';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newValidation.subject = 'El asunto es requerido';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newValidation.message = 'El mensaje es requerido';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newValidation.message = 'El mensaje debe tener al menos 10 caracteres';
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar mensajes de validación al escribir
    if (validation[name]) {
      setValidation({
        ...validation,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulación de envío de formulario
    setTimeout(() => {
      console.log('Formulario enviado:', formData);
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para responder tus preguntas y ayudarte en todo lo que necesites.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-content">
                <h3>Dirección</h3>
                <p>Av. Constitución 1500</p>
                <p>Querétaro, QRO, 76000</p>
                <p>México</p>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-content">
                <h3>Teléfono</h3>
                <p>+52 (442) 123-4567</p>
                <p>Lunes a Viernes: 9am - 6pm</p>
                <p>Sábados: 10am - 3pm</p>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-content">
                <h3>Email</h3>
                <p>hunterscandy@hunterscandy.com</p>
                <p>soporte@hunterscandy.com</p>
              </div>
            </div>
            
            <div className="social-links">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envíanos un mensaje</h2>
            
            {formStatus.submitted && formStatus.success ? (
              <div className="form-success">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <p>{formStatus.message}</p>
                <button 
                  onClick={() => setFormStatus({ submitted: false, success: false, message: '' })}
                  className="new-message-btn"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={validation.name ? 'input-error' : ''}
                    />
                    {validation.name && <span className="error-message">{validation.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      className={validation.email ? 'input-error' : ''}
                    />
                    {validation.email && <span className="error-message">{validation.email}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(442) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Asunto *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Asunto de tu mensaje"
                      className={validation.subject ? 'input-error' : ''}
                    />
                    {validation.subject && <span className="error-message">{validation.subject}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows="6"
                    className={validation.message ? 'input-error' : ''}
                  ></textarea>
                  {validation.message && <span className="error-message">{validation.message}</span>}
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Enviar mensaje
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="contact-location">
          <h2>Nuestra ubicación</h2>
          <div className="location-details">
            <div className="location-info">
              <i className="fas fa-directions"></i>
              <p>Estamos ubicados en una zona comercial de fácil acceso, con estacionamiento disponible para nuestros clientes.</p>
            </div>
            <div className="location-hours">
              <i className="fas fa-clock"></i>
              <div>
                <h3>Horario de atención</h3>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 3:00 PM</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;