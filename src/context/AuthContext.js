import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

// Crear el contexto de autenticación fuera del AuthProvider
const AuthContext = createContext(); 

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
  }, []);

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

  const validateMFA = async (token) => {
    try {
      const userData = await authService.validateMFA(mfaUsername, token);
      setUser(userData);
      setIsAuthenticated(true);
      setRequireMFA(false);
      setMfaUsername('');
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const setupMFA = async () => {
    try {
      return await authService.setupMFA();
    } catch (error) {
      throw error;
    }
  };

// En AuthContext.js
const verifyAndEnableMFA = async (token) => {
  try {
    const response = await authService.verifyAndEnableMFA(token);
    
    // Actualizar el estado del usuario localmente después de activar MFA
    setUser(prevUser => ({
      ...prevUser,
      mfaEnabled: true
    }));
    
    // También actualizar el usuario en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...storedUser,
      mfaEnabled: true
    }));
    
    return response;
  } catch (error) {
    throw error;
  }
};

  const disableMFA = async (token, password) => {
    try {
      return await authService.disableMFA(token, password);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const formattedUserData = {
        ...userData,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || ''
      };

      const newUser = await authService.register(formattedUserData);
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateUserProfile(userData);
      setUser({ ...user, ...updatedUser });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

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
    disableMFA
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
