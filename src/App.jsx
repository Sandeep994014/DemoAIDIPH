import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import './App.css';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import AuthProvider, { useAuth } from './auth/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Delivery from './pages/Delivery';
import Profile from './pages/Profile';
import WishList from './pages/wishList';
import History from './pages/History';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <CssBaseline />
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <RequireAuth>
                        <HomePage />
                    </RequireAuth>
                    } />
                <Route
                  path="/cart"
                  element={
                    <RequireAuth>
                      <CartPage />
                   </RequireAuth>
                  }
                />
                <Route
                  path="/delivery"
                  element={
                    <RequireAuth>
                      <Delivery />
                   </RequireAuth>
                  }
                />
                <Route path="/wishlist" element={
                  <RequireAuth>
                 <WishList/>
                  </RequireAuth>
                } />
                <Route path="/profile" element={
                   <RequireAuth>
                     <Profile/>
                   </RequireAuth>
                  } />
                <Route path="/order-history" element={
                  //  <RequireAuth>
                     <History />
                  //  </RequireAuth>
                  } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
