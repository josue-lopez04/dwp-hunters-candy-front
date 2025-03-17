import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
                <i className="fa fa-map-marker"></i>
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
                <i className="fa fa-phone"></i>
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
                <i className="fa fa-envelope"></i>
              </div>
              <div className="info-content">
                <h3>Email</h3>
                <p>info@hunterscandy.com</p>
                <p>soporte@hunterscandy.com</p>
              </div>
            </div>
            
            <div className="social-links">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fa fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envíanos un mensaje</h2>
            
            {formStatus.submitted && formStatus.success ? (
              <div className="form-success">
                <div className="success-icon">
                  <i className="fa fa-check-circle"></i>
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
                      required
                    />
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
                      required
                    />
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
                      required
                    />
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
                    required
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Enviar mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="contact-map">
          <div className="map-container">
            {/* Aquí iría un mapa de Google Maps o similar, ya vere */}
            <div className="map-placeholder">
              <div className="map-icon">
                <i className="fa fa-map"></i>
              </div>
              <p>Mapa de ubicación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;