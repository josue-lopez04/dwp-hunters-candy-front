import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Home from './Pages/Home/Home';
import Inventory from './Pages/Inventory/Inventory';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Profile from './Pages/Profile/Profile';
import Cart from './Pages/Cart/Cart';
import Contact from './Pages/Contact/Contact';
import Error from './Pages/Error/Error';
import './App.css';

// function App() {
//   // Simulación de autenticación (esto sería reemplazado por un contexto real de autenticación)
//   const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

//   return (
//     <Router>
//       <Routes>
//         {/* Rutas públicas (sin layout) */}
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to="/" replace /> : <Login />
//         } />
//         <Route path="/register" element={
//           isAuthenticated ? <Navigate to="/" replace /> : <Register />
//         } />
        
//         {/* Rutas protegidas con layout */}
//         <Route path="/" element={
//           isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
//         }>
//           <Route index element={<Home />} />
//           <Route path="inventory" element={<Inventory />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="*" element={<Error />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// } 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (sin layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas con layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Error />} />
        </Route>
        
        {/* Redirección por defecto al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}


export default App; 