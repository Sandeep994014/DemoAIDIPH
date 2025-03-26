import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getProducts, toggleWishlist, addToCart as addToCartAPI } from '../services/auth';  
import { useAuth } from '../auth/AuthContext'; 
import { Favorite } from '@mui/icons-material'; 
import { useCart } from '../contexts/CartContext'; 
import { useFavorites } from '../contexts/FavoritesContext'; 
export default function FeatureProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState({}); 
  const [cartError, setCartError] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');
  const [userId, setUserId] = useState(null); 
  const [authToken, setAuthToken] = useState(null); 
  const { addToCart } = useCart(); 
  const { addToFavorites, removeFromFavorites } = useFavorites(); 
  const effectRan = useRef(false); 
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  const fetchProducts = async () => {
    if (!userId) return; 
    setLoading(true);
    try {
      const productsData = await getProducts(userId);
      const productList = Array.isArray(productsData?.content) ? productsData.content : [];
      setProducts(productList);
      setError(null);
      const initialSizeSelection = productList.reduce((acc, product) => {
        const firstVariant = product.productVariants[0];
        acc[product.id] = firstVariant;
        return acc;
      }, {});
      setSelectedSize(initialSizeSelection);
    } catch (error) {
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!authToken || !userId || effectRan.current) return;
    effectRan.current = true;
    fetchProducts();
  }, [authToken, userId]);
  const handleSizeChange = (productId, size) => {
    setSelectedSize(prevState => ({
      ...prevState,
      [productId]: size
    }));
  };
  const handleAddToCart = async (product, quantity) => {
    if (!selectedSize[product.id]) {
      setCartError("Please select a size before adding to cart.");
      setCartSuccess("");
      return;
    }
    const selectedQuantity = quantity > 0 ? quantity : 1;
    const selectedSizeValue = selectedSize[product.id]?.size;
    try {
      addToCart({
        id: product.id,
        name: product.name,
        size: selectedSizeValue,
        quantity: selectedQuantity,
        points: product.point,
        image: selectedSize[product.id]?.imageUrls[0] || product.imageUrls[0],
      });
      const response = await addToCartAPI(product.id, selectedQuantity, selectedSizeValue, authToken);
      alert(response.message); 
      setCartSuccess("Product added to cart successfully!");
      setCartError("");
    } catch (error) {
      setCartError("Failed to add the product to the cart. Please try again.");
      setCartSuccess("");
    }
  };
  const handleToggleWishlist = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product.isInWishlist) {
        removeFromFavorites(productId); 
      } else {
        addToFavorites(product); 
      }
      await toggleWishlist(productId, authToken);
      setProducts((prevState) =>
        prevState.map((product) =>
          product.id === productId
            ? { ...product, isInWishlist: !product.isInWishlist }
            : product
        )
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  if (loading) {
    return <Typography variant="h6" align="center">Loading products...</Typography>;
  }
  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }
  if (products.length === 0) {
    return <Typography variant="h6" align="center">No products available.</Typography>;
  }
  return (
    <div>
      <Typography textAlign={'center'} variant="h3" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="260"
                image={selectedSize[product.id]
                    ? selectedSize[product.id]?.imageUrls[0]
                    : (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.jpg')}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.brand}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.primary">
                    {product.point} Points
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={selectedSize[product.id]?.size || ''}
                    onChange={(e) => handleSizeChange(product.id, product.productVariants.find(variant => variant.size === e.target.value))}
                    label="Size"
                  >
                    {product.productVariants.map((variant) => (
                      <MenuItem key={variant.id} value={variant.size}>
                        {variant.size} - {variant.color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={9}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product, 1)} 
                  >
                    Add to Cart
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant=""
                    color="secondary"
                    onClick={() => handleToggleWishlist(product.id)} 
                  >
                    <Favorite sx={{fontSize: 30}} color={product.isWishlisted === true ? "error" : "primary"} />
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}