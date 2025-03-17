import React from 'react';
import { Outlet } from 'react-router-dom';
import './Footer/Footer.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 Hunter's Candy/ Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default MainLayout;