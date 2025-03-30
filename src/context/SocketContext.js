// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    // Recuperar notificaciones guardadas del localStorage
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const { user } = useAuth();

  // Conectar al servidor WebSocket
  useEffect(() => {
    try {
        const SOCKET_URL = process.env.REACT_APP_API_URL;
        const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
      
      // Hacer el socket disponible globalmente para que otros componentes puedan emitir eventos
      window.socket = newSocket;
      
      return () => {
        newSocket.disconnect();
        window.socket = null;
      };
    } catch (error) {
      console.error('Error al conectar con WebSocket:', error);
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Unirse a sala cuando el usuario inicia sesión
  useEffect(() => {
    if (socket && user) {
      socket.emit('join', user._id);
      
      // Escuchar actualizaciones de órdenes
      socket.on('orderStatusChanged', (data) => {
        const newNotification = {
          id: Date.now(),
          message: `Tu orden ${data.orderId} ha cambiado a estado: ${data.status}`,
          time: new Date().toLocaleTimeString(),
          read: false,
          type: 'order'
        };
        
        addNotification(newNotification);
      });
      
      // Escuchar alertas de stock
      socket.on('stockAlert', (data) => {
        const newNotification = {
          id: Date.now(),
          message: `¡Pocas unidades disponibles! Solo quedan ${data.stock} unidades de ${data.productName}.`,
          time: new Date().toLocaleTimeString(),
          read: false,
          type: 'stock',
          productId: data.productId
        };
        
        addNotification(newNotification);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('orderStatusChanged');
        socket.off('stockAlert');
      }
    };
  }, [socket, user]);

  // Añadir notificación (evitar duplicados)
  const addNotification = (notification) => {
    setNotifications(prev => {
      // Verificar si ya existe una notificación similar reciente (últimos 5 minutos)
      const isDuplicate = prev.some(
        n => n.type === notification.type && 
             (n.type === 'stock' && n.productId === notification.productId) &&
             (new Date().getTime() - new Date(n.time).getTime() < 300000)
      );
      
      // Si es un duplicado, no añadir
      if (isDuplicate) return prev;
      
      // Limitar a 50 notificaciones
      const updatedNotifications = [notification, ...prev];
      if (updatedNotifications.length > 50) {
        return updatedNotifications.slice(0, 50);
      }
      return updatedNotifications;
    });
  };

  // Añadir una notificación de forma manual (para testing y demostración)
  const addTestNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: 'test'
    };
    
    addNotification(newNotification);
  };

  // Marcar notificación como leída
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    );
  };

  // Limpiar todas las notificaciones
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Para facilitar las pruebas, hacemos que productos con stock bajo generen notificaciones
  // Esta función simula el comportamiento del servidor
  const checkProductStock = (product) => {
    if (product && product.stock > 0 && product.stock <= 5) {
      const stockAlert = {
        id: Date.now(),
        message: `¡Stock bajo! Solo quedan ${product.stock} unidades de ${product.name}.`,
        time: new Date().toLocaleTimeString(),
        read: false,
        type: 'stock',
        productId: product._id || product.id
      };
      
      addNotification(stockAlert);
    }
  };
  
  return (
    <SocketContext.Provider value={{ 
      socket, 
      notifications, 
      markAsRead, 
      clearNotifications,
      addTestNotification,
      checkProductStock
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;