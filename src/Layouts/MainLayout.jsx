import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="app-container">
      <header>
        <h1>Hunter's Candy</h1>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 Hunter's Candy</p>
      </footer>
    </div>
  );
};

export default MainLayout;