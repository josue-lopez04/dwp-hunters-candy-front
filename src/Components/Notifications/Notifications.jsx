// src/Components/Notifications/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './Notifications.css';

const Notifications = () => {
  const { notifications, markAsRead, clearNotifications } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  
  // Cerrar el panel de notificaciones cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationsPanel = document.querySelector('.notifications-container');
      if (notificationsPanel && !notificationsPanel.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Efecto para cerrar el panel después de un tiempo sin actividad
  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 10000); // Cerrar después de 10 segundos de inactividad
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);
  
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };
  
  return (
    <div className="notifications-container">
      <div className="notifications-icon" onClick={toggleNotifications}>
        <i className="fa fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notificaciones</h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="clear-notifications-btn"
              >
                Limpiar todo
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No tienes notificaciones</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;