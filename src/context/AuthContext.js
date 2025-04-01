import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

// Crear el contexto de autenticación
const AuthContext = createContext(); 

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

// Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requireMFA, setRequireMFA] = useState(false);
  const [mfaUsername, setMfaUsername] = useState('');

  // Verificar si hay un usuario autenticado al cargar la página
  useEffect(() => {
    const checkAuthentication = () => {
      const isLoggedIn = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      setIsAuthenticated(isLoggedIn);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuthentication();
    
    // Añadir evento para verificar el token caducado al cambiar a otra pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthentication();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Limpiar el listener al desmontar
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Función de login
  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);

      if (userData.requireMFA) {
        setRequireMFA(true);
        setMfaUsername(userData.username);
        return { requireMFA: true };
      }

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Función para validar MFA durante el login
  const validateMFA = async (username, token) => {
    try {
      const userData = await authService.validateMFA(username || mfaUsername, token);
      setUser(userData);
      setIsAuthenticated(true);
      setRequireMFA(false);
      setMfaUsername('');
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Configurar MFA
  const setupMFA = async () => {
    try {
      return await authService.setupMFA();
    } catch (error) {
      throw error;
    }
  };

  // Verificar y activar MFA
  const verifyAndEnableMFA = async (token) => {
    try {
      const response = await authService.verifyAndEnableMFA(token);
      
      // Actualizar el estado del usuario localmente después de activar MFA
      setUser(prevUser => ({
        ...prevUser,
        mfaEnabled: true
      }));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Desactivar MFA
  const disableMFA = async (token, password) => {
    try {
      const response = await authService.disableMFA(token, password);
      
      // Actualizar el estado del usuario localmente después de desactivar MFA
      setUser(prevUser => ({
        ...prevUser,
        mfaEnabled: false
      }));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Registrar usuario
  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setRequireMFA(false);
    setMfaUsername('');
  };

  // Actualizar perfil de usuario
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateUserProfile(userData);
      setUser({ ...user, ...updatedUser });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Recuperar contraseña
  const forgotPassword = async (email) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Restablecer contraseña
  const resetPassword = async (token, password) => {
    try {
      return await authService.resetPassword(token, password);
    } catch (error) {
      throw error;
    }
  };

  // Valor del contexto que será proporcionado
  const value = {
    user,
    loading,
    isAuthenticated,
    requireMFA,
    mfaUsername,
    login,
    validateMFA,
    register,
    logout,
    updateProfile,
    setupMFA,
    verifyAndEnableMFA,
    disableMFA,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;