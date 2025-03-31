// src/services/api.js (Versión modificada)
import axios from 'axios';

// URL base para todas las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Para CORS
  withCredentials: true
});

// Interceptor para añadir el token a las peticiones autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (No autorizado), podríamos manejar el logout automático
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      
      // Opcional: redirigir a login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;