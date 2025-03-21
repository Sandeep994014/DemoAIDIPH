import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Box, Typography, Button, IconButton, Card, Stack, CircularProgress } from '@mui/material';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ShoppingCart as Cart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { fetchCart, updateQuantity as updateQuantityService, removeFromCart as removeFromCartService } from '../services/auth';

const CartPage = () => {
  const { getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [cart, setCart] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPoints, setLoadingPoints] = useState(true);

  const cartItems = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const cartData = await fetchCart(authToken);
      const arr = cartData?.products?.map(product => ({
        id: product.productId,
        name: product.productName,
        size: product.variants[0].size,
        quantity: product.variants[0].quantity,
        points: product.variants[0].point,
        totalPoints: product.variants[0].totalPoint,
        image: product.variants[0].imageUrls[0] || "/placeholder.svg"
      }));
      setCart(arr);
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cartItems();
  }, []);

  useEffect(() => {
    setCartTotal(getCartTotal());
    setTotalPoints(cart.reduce((acc, product) => acc + product.points * product.quantity, 0));
    setTotalProducts(cart.reduce((acc, product) => acc + product.quantity, 0));
  }, [cart]);

  const fetchUserPoints = async () => {
    try {
      setLoadingPoints(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const response = await profileUser(authToken);
      setUserPoints(response.points);
    } catch (error) {
      alert('Failed to load user points', error.response?.data?.message);
    } finally {
      setLoadingPoints(false);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await updateQuantityService(productId, quantity, authToken);
      setCart(prevCart => prevCart.map(product => product.id === productId ? { ...product, quantity } : product));
    } catch (error) {
      alert('Failed to update product quantity');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await removeFromCartService(productId, authToken);
      setCart(prevCart => prevCart.filter(product => product.id !== productId));
    } catch (error) {
      alert('Failed to remove product from cart');
    }
  };

  const totalAmount = cartTotal;

  const handleCheckout = () => {
    if (isAuthenticated) {
      if (totalPoints <= userPoints) {
        navigate("/delivery");
      } else {
        alert("You do not have enough points to place this order.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cart?.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 6, p: 6, borderRadius: '50%', backgroundColor: 'blue' }}>
          <Cart className="h-12 w-12 text-blue-500" />
        </Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Your cart is empty</Typography>
        <Button variant="contained" color="primary" component={Link} to="/">Continue Shopping</Button>
      </Box>
    );
  } else {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
        <Typography variant="h6" gutterBottom>Items in Cart ({cart?.length})</Typography>
        <Stack direction="row" spacing={4}>
          <Box sx={{ flex: 2 }}>
            <Card sx={{ padding: 2 }}>
              <Box>
                {cart?.map((product, index) => (
                  <Box key={index} sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: 100, height: 100, position: "relative", backgroundColor: "#f0f0f0" }}>
                        <img src={product.image || "/placeholder.svg"} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="body1">{product.name}</Typography>
                            <Typography variant="body2" color="textSecondary">Size: {product.size}</Typography>
                            <Typography variant="body2" color="textSecondary">Points: {product.points}</Typography>
                          </Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 1 }}>
                              <IconButton onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 1} sx={{ padding: 1 }}>
                                <Minus />
                              </IconButton>
                              <Typography variant="body2" sx={{ width: 30, textAlign: "center" }}>
                                {product.quantity}
                              </Typography>
                              <IconButton onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)} sx={{ padding: 1 }}>
                                <Plus />
                              </IconButton>
                            </Box>
                            <IconButton color="error" onClick={() => handleRemoveFromCart(product.id)}>
                              <Trash2 />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
          <Box sx={{ width: 320 }}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">Total Points</Typography>
                  <Typography variant="body1">{userPoints}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">Total Products</Typography>
                  <Typography variant="body1">{totalProducts}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">Products Points</Typography>
                  <Typography variant="body1">{totalPoints}</Typography>
                </Stack>
                <Button variant="contained" sx={{ width: "100%" }} onClick={handleCheckout}>
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Box textAlign="center">
                  <Link to="/" style={{ fontSize: "0.875rem", color: "#1976d2" }}>
                    Continue Shopping
                  </Link>
                </Box>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Box>
    );
  }
};

export default CartPage;
