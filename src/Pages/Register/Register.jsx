import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

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
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio';
        }

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
            email: formData.email,
            name: `${formData.nombre} ${formData.apellido}`
        }));

        navigate('/');
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

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Introduce nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'input-error' : ''}
                                placeholder="Nombre"
                            />
                            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Introduce apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className={errors.apellido ? 'input-error' : ''}
                                placeholder="Apellido"
                            />
                            {errors.apellido && <div className="error-message">{errors.apellido}</div>}
                        </div>
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

                    <button type="submit" className="register-button">
                        Registrar
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