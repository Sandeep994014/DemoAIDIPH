// src/router/Router.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import Delivery from '../pages/Delivery';
import WishList from '../pages/WishList';
import History from '../pages/History';
import NotFound from '../pages/NotFound';
import { useAuth } from '../auth/AuthContext'; // Ensure useAuth is imported

// RequireAuth component for protecting private routes
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function Router() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/delivery" element={<RequireAuth><Delivery /></RequireAuth>} />
          <Route path="/wishlist" element={<RequireAuth><WishList /></RequireAuth>} />
          <Route path="/order-history" element={<RequireAuth><History /></RequireAuth>} />

          {/* Catch-all for non-existent routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default Router;
