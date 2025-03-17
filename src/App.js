import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Home from './Pages/Home/Home';
import Inventory from './Pages/Inventory/Inventory';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Profile from './Pages/Profile/Profile';
import Cart from './Pages/Cart/Cart';
import Contact from './Pages/Contact/Contact';
import Error from './Pages/Error/Error';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:id" element={<ProductDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Error />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;