import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cart.service';

// Crear el contexto del carrito
const CartContext = createContext();

// Definir el estado inicial
const initialState = {
  cartItems: [],
  loading: true,
  couponCode: '',
  couponApplied: false,
  discountAmount: 0
};

// Definir el reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADED':
      return {
        ...state,
        cartItems: action.payload,
        loading: false
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: action.payload
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: action.payload
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: action.payload
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        couponCode: '',
        couponApplied: false,
        discountAmount: 0
      };
    case 'APPLY_COUPON':
      return {
        ...state,
        couponCode: action.payload.couponCode,
        couponApplied: true,
        discountAmount: action.payload.discountAmount
      };
    case 'REMOVE_COUPON':
      return {
        ...state,
        couponCode: '',
        couponApplied: false,
        discountAmount: 0
      };
    default:
      return state;
  }
};

// Crear el proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito al iniciar
  useEffect(() => {
    const loadCart = () => {
      const cartItems = cartService.getCart();
      dispatch({ type: 'CART_LOADED', payload: cartItems });
    };

    loadCart();
  }, []);

  // Función para añadir un producto al carrito
  const addToCart = (product, quantity) => {
    const updatedCart = cartService.addToCart(product, quantity);
    dispatch({ type: 'ADD_TO_CART', payload: updatedCart });
  };

  // Función para actualizar la cantidad de un producto
  const updateItemQuantity = (productId, quantity) => {
    const updatedCart = cartService.updateCartItemQuantity(productId, quantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: updatedCart });
  };

  // Función para eliminar un producto del carrito
  const removeItem = (productId) => {
    const updatedCart = cartService.removeFromCart(productId);
    dispatch({ type: 'REMOVE_ITEM', payload: updatedCart });
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    cartService.clearCart();
    dispatch({ type: 'CLEAR_CART' });
  };

  // Función para calcular el subtotal
  const calculateSubtotal = () => {
    return cartService.calculateSubtotal(state.cartItems);
  };

  // Función para calcular el total
  const calculateTotal = () => {
    return calculateSubtotal() - state.discountAmount;
  };

  // Función para aplicar un cupón
  const applyCoupon = async (couponCode) => {
    try {
      const subtotal = calculateSubtotal();
      const result = await cartService.applyCoupon(couponCode, subtotal);
      
      if (result.valid) {
        dispatch({
          type: 'APPLY_COUPON',
          payload: {
            couponCode,
            discountAmount: result.discountAmount
          }
        });
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  // Función para eliminar un cupón
  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  // Valor que se proporcionará a los consumidores del contexto
  const value = {
    ...state,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    applyCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;