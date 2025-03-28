// src/Layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;