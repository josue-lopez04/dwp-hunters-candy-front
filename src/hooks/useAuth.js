// Ubicación: /src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom hook para acceder al contexto de autenticación
 * 
 * @returns {Object} El contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return context;
};

export default useAuth;