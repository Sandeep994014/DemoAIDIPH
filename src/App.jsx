import React from 'react';
import { CssBaseline } from '@mui/material';
import AuthProvider from './auth/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Router from './router/Router';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CssBaseline />
          <Router /> 
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
