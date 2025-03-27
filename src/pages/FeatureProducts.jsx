import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getProducts, toggleWishlist, addToCart as addToCartAPI } from '../services/auth';  
import { Favorite } from '@mui/icons-material'; 
import { useCart } from '../contexts/CartContext'; 
import { useFavorites } from '../contexts/FavoritesContext'; 
import { toast , ToastContainer } from 'react-toastify'; // Added import for react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles

export default function FeatureProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState({}); 
  const [cartSuccess, setCartSuccess] = useState('');
  console.log("cartSuccess", cartSuccess);
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
      setCartSuccess("");
      toast.error("Please select a size before adding to cart."); // Replaced alert with toast
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
      toast.success(response.message); // Replaced alert with toast
      setCartSuccess("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add product to cart. Please try again."); // Replaced alert with toast
      setCartSuccess("");
    }
  };
  const handleToggleWishlist = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product.isInWishlist) {
        removeFromFavorites(productId); 
        toast.info("Removed from wishlist."); // Added toast for removing from wishlist
      } else {
        addToFavorites(product); 
        toast.success("Added to wishlist."); // Added toast for adding to wishlist
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
      toast.error("Error toggling wishlist. Please try again."); // Replaced alert with toast
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
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
        {products.map((product) => {
          const productImage = selectedSize[product.id]?.imageUrls?.[0] || product.imageUrls?.[0] || '/placeholder.jpg';
          return (
            <Box key={product.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="260"
                  image={productImage}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.brand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
                <Box display="flex" justifyContent="space-between" padding={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product, 1)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant=""
                    color="secondary"
                    onClick={() => handleToggleWishlist(product.id)}
                  >
                    <Favorite sx={{ fontSize: 30 }} color={product.isWishlisted === true ? "error" : "primary"} />
                  </Button>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>
      <ToastContainer />
    </div>
  );
}