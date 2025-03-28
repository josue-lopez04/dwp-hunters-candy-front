import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        
        // Limpiar error del servidor cuando el usuario comienza a escribir
        if (serverError) setServerError('');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es obligatorio';
        }

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            
            // Preparar los datos para enviar al backend
            const userData = {
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                password: formData.password
            };
            
            await register(userData);
            navigate('/');
        } catch (error) {
            setServerError(error.message || 'Error al registrar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-logo">
                    <img src="/logo.jpeg" alt="Logo de HC" />
                </div>
                <div className="register-header">
                    <h1>Hola bienvenido</h1>
                    <p>Crea tu cuenta para comenzar</p>
                </div>

                {serverError && (
                    <div className="error-alert">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'input-error' : ''}
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Introduce correo</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                            placeholder="correo@ejemplo.com"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Nombre</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'input-error' : ''}
                                placeholder="Tu nombre"
                            />
                            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Apellidos</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'input-error' : ''}
                                placeholder="Tus apellidos"
                            />
                            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono (opcional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Tu número de teléfono"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Introduce contraseña</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'input-error' : ''}
                                placeholder="********"
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirma contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'input-error' : ''}
                            placeholder="********"
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>

                    <div className="form-group checkbox-group">
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="acceptTerms" className="checkbox-label">
                                Acepto los <Link to="/terms-and-conditions">términos y condiciones</Link>
                            </label>
                        </div>
                        {errors.acceptTerms && <div className="error-message">{errors.acceptTerms}</div>}
                    </div>

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>

                    <div className="login-link">
                        <span>¿Ya tienes cuenta?</span>
                        <Link to="/login">Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;