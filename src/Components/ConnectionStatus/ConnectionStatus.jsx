import React from 'react';
import { useSocket } from '../../context/SocketContext';
import './ConnectionStatus.css';

/**
 * Componente que muestra el estado de conexión (online/offline)
 * @returns {JSX.Element} Componente de estado de conexión
 */
const ConnectionStatus = () => {
  const { isOnline } = useSocket();
  
  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="connection-indicator"></div>
      <span className="connection-text">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default ConnectionStatus;