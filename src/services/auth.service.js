import axios from 'axios';

// Crear una instancia de axios con la URL base
const API_URL = `${process.env.REACT_APP_API_URL}/users` || 'http://localhost:5000/api/users';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

// Servicio de autenticación
const authService = {
// Iniciar sesión
login: async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    
    // Si se requiere MFA, retornar sin guardar token
    if (response.data.requireMFA) {
      return response.data;
    }
    
    // Login normal
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},

// Validar MFA durante login
validateMFA: async (username, token) => {
  try {
    const response = await api.post('/mfa/validate', { username, token });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},

// Configurar MFA
setupMFA: async () => {
  try {
    const response = await api.get('/mfa/setup');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},

// En auth.service.js, asegúrate de que cuando se active MFA, se actualice el usuario almacenado:

// Verificar y activar MFA
verifyAndEnableMFA: async (token) => {
  try {
    const response = await api.post('/mfa/verify', { token });
    
    // Actualizar el usuario almacenado localmente
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.mfaEnabled = true;
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},

// Desactivar MFA
disableMFA: async (token, password) => {
  try {
    const response = await api.post('/mfa/disable', { token, password });
    
    // Actualizar el usuario almacenado localmente
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.mfaEnabled = false;
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},
  
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },
// Solicitar recuperación de contraseña
forgotPassword: async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},

// Restablecer contraseña
resetPassword: async (token, password) => {
  try {
    const response = await axios.put(`${API_URL}/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('cart');
  },
  
  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  // Obtener el usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Obtener el perfil del usuario
  getUserProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },
  
// Actualizar el perfil del usuario
updateUserProfile: async (userData) => {
  try {
    const response = await api.put('/profile', userData);
    
    // Actualizar los datos en localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...response.data
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
},
  
  // Añadir dirección
  addUserAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },
  
  // Actualizar dirección
  updateUserAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },
  
  // Eliminar dirección
  deleteUserAddress: async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  }
}; 

export default authService;