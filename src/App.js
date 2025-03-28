import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes de autenticación
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import Logout from './Components/Logout';
import ProtectedRoute from './Components/ProtectedRoute';

// Páginas principales
import MainLayout from './Layouts/MainLayout';
import Home from './Pages/Home/Home';
import Inventory from './Pages/Inventory/Inventory';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import Profile from './Pages/Profile/Profile';
import Cart from './Pages/Cart/Cart';
import Contact from './Pages/Contact/Contact';
import Error from './Pages/Error/Error';

// Nuevas páginas de checkout y confirmación de orden
import Checkout from './Pages/Checkout/Checkout';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:id" element={<ProductDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Error />} />
        </Route>

        {/* Redirigir cualquier ruta no encontrada al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;