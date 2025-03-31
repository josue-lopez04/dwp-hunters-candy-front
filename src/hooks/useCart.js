// Ubicación: /src/hooks/useCart.js
import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Custom hook para acceder al contexto del carrito
 * 
 * @returns {Object} El contexto del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  
  return context;
};

export default useCart;