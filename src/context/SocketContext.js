// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// Hook personalizado para usar el contexto de Socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser utilizado dentro de un SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    // Recuperar notificaciones guardadas del localStorage
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user } = useAuth();

  // Detectar estado de conexión a internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addSystemNotification('Conexión a internet restablecida. Modo online activado.');
    };

    const handleOffline = () => {
      setIsOnline(false);
      addSystemNotification('Sin conexión a internet. Modo offline activado.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Conectar al servidor WebSocket
  useEffect(() => {
    if (!isOnline) {
      console.log('No hay conexión a internet. WebSocket no se iniciará.');
      return;
    }

    try {
      // Usar WebSocket nativo en lugar de Socket.io
      // Para desarrollo usamos ws:// y para producción wss://
      const isDevelopment = process.env.NODE_ENV === 'development';
      const SOCKET_URL = isDevelopment 
        ? 'ws://localhost:5000/ws'  // URL para desarrollo
        : 'wss://hunters-candy-backend.vercel.app/ws';  // URL para producción
      
      console.log(`Intentando conectar a WebSocket: ${SOCKET_URL}`);
      const newSocket = new WebSocket(SOCKET_URL);
      
      // Configurar evento de conexión
      newSocket.onopen = () => {
        console.log('WebSocket conectado');
        setSocket(newSocket);
        addSystemNotification('Conexión establecida con el servidor.');
        
        // Si el usuario está autenticado, enviar mensaje de unión
        if (user) {
          const message = JSON.stringify({
            type: 'join',
            userId: user._id
          });
          if (newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(message);
          }
        }
      };
      
      // Configurar evento de mensaje recibido
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Mensaje WebSocket recibido:', data);
          
          // Manejar diferentes tipos de mensajes
          switch (data.type) {
            case 'connection':
              // Mensaje de conexión inicial
              addSystemNotification('Bienvenido a Hunter\'s Candy!');
              break;
              
            case 'joined':
              // Mensaje cuando un usuario se une a su sala
              addSystemNotification('Has iniciado sesión correctamente. ¡Bienvenido!');
              break;
              
            case 'orderStatusChanged':
              handleOrderStatusChanged(data);
              break;
              
            case 'stockAlert':
              handleStockAlert(data);
              break;
              
            default:
              console.log('Mensaje WebSocket sin manejar:', data);
              // Para mensajes genéricos podemos mostrar el mensaje directamente si existe
              if (data.message) {
                addSystemNotification(data.message);
              }
          }
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };
      
      // Configurar evento de error
      newSocket.onerror = (error) => {
        console.error('Error de WebSocket:', error);
        addSystemNotification('Error de conexión con el servidor.');
      };
      
      // Configurar evento de cierre
      newSocket.onclose = () => {
        console.log('WebSocket desconectado');
        addSystemNotification('Conexión con el servidor perdida.');
        
        // Intentar reconectar después de un tiempo
        setTimeout(() => {
          console.log('Intentando reconexión de WebSocket...');
          // La reconexión ocurrirá automáticamente debido a este effect
        }, 5000);
      };
      
      // Hacer el socket disponible globalmente
      window.socket = {
        // Crear una interfaz compatible con socket.io
        emit: (eventName, data) => {
          if (newSocket && newSocket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
              type: eventName,
              ...data
            });
            newSocket.send(message);
          }
        },
        // Proporcionar acceso al WebSocket nativo
        webSocket: newSocket
      };
      
      return () => {
        if (newSocket && newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
        window.socket = null;
      };
    } catch (error) {
      console.error('Error al conectar con WebSocket:', error);
      addSystemNotification('No se pudo conectar con el servidor.');
    }
  }, [isOnline, user]);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Añadir notificación del sistema
  const addSystemNotification = (message) => {
    const notification = {
      id: Date.now() + Math.random(), // Asegurar IDs únicos
      message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: 'system'
    };
    addNotification(notification);
  };

  // Manejador de evento de cambio de estado de orden
  const handleOrderStatusChanged = (data) => {
    const newNotification = {
      id: Date.now() + Math.random(), // Asegurar IDs únicos
      message: `Tu orden ${data.orderId} ha cambiado a estado: ${data.status}`,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: 'order'
    };
    
    addNotification(newNotification);
  };
  
  // Manejador de evento de alerta de stock
  const handleStockAlert = (data) => {
    const newNotification = {
      id: Date.now() + Math.random(), // Asegurar IDs únicos
      message: `¡Pocas unidades disponibles! Solo quedan ${data.stock} unidades de ${data.productName}.`,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: 'stock',
      productId: data.productId
    };
    
    addNotification(newNotification);
  };

  // Añadir notificación (evitar duplicados)
  const addNotification = (notification) => {
    setNotifications(prev => {
      // Verificar si ya existe una notificación similar reciente (últimos 5 minutos)
      const isDuplicate = prev.some(
        n => n.type === notification.type && 
             ((n.type === 'stock' && n.productId === notification.productId) ||
              (n.type === 'system' && n.message === notification.message)) &&
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
      id: Date.now() + Math.random(), // Asegurar IDs únicos
      message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: 'test'
    };
    
    addNotification(newNotification);
  };

  // Simular alerta de stock bajo para un producto
  const simulateStockAlert = (product) => {
    if (product) {
      const stockAlert = {
        id: Date.now() + Math.random(), // Asegurar IDs únicos
        message: `¡Alerta de stock! Solo quedan ${product.stock || 3} unidades de ${product.name}.`,
        time: new Date().toLocaleTimeString(),
        read: false,
        type: 'stock',
        productId: product._id || product.id
      };
      
      addNotification(stockAlert);
    }
  };

  // Enviar evento al servidor (método para compatibilidad con Socket.io)
  const emit = (eventName, data) => {
    if (window.socket) {
      window.socket.emit(eventName, data);
    } else {
      console.warn('WebSocket no disponible. Operación en modo offline.');
    }
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
        id: Date.now() + Math.random(), // Asegurar IDs únicos
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
      checkProductStock,
      simulateStockAlert,
      emit,
      isOnline,
      addSystemNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;