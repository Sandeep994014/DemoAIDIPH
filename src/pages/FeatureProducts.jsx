import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getProducts, addToCart, toggleWishlist } from '../services/auth';  
import { useAuth } from '../auth/AuthContext';
import { Favorite } from '@mui/icons-material';

export default function FeatureProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState({}); 
  const [cartError, setCartError] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');
  const { userId, authToken } = useAuth(); 

  // Fetch products when the component is mounted
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts(userId);
      const productList = Array.isArray(productsData?.content) ? productsData.content : [];
      setProducts(productList);
      setError(null);

      // Initialize size selection for each product
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
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  // Handle size change for each product
  const handleSizeChange = (productId, size) => {
    setSelectedSize(prevState => ({
      ...prevState,
      [productId]: size
    }));
  };

  // Add product to the cart
  const handleAddToCart = async (product, quantity) => {
    if (!selectedSize[product.id]) {
      setCartError("Please select a size before adding to cart.");
      setCartSuccess("");
      return;
    }

    const selectedQuantity = quantity > 0 ? quantity : 1; // Ensure valid quantity
    const selectedSizeValue = selectedSize[product.id]?.size;  // Get the size from the selected state

    try {
      // Pass productId, quantity, selectedSizeValue to the service
      const response = await addToCart(product.id, selectedQuantity, selectedSizeValue, authToken);
      setCartSuccess("Product added to cart successfully!");
      setCartError("");
      alert(response.message);  // Assuming `response.message` is the success message
    } catch (error) {
      setCartError("Failed to add the product to the cart. Please try again.");
      setCartSuccess("");
    }
  };

  // Toggle product wishlist status
  const handleToggleWishlist = async (productId) => {
    try {
      const response = await toggleWishlist(productId, authToken);
      setProducts(prevState => prevState.map(product =>
        product.id === productId
          ? { 
              ...product, 
              isInWishlist: !product.isInWishlist 
            }
          : product
      ));
      alert(response.message);
      fetchProducts();
      setLoading(true);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Show loading message while fetching products
  if (loading) {
    return <Typography variant="h6" align="center">Loading products...</Typography>;
  }

  // Show error message if something went wrong
  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  // Show message when no products are available
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
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleToggleWishlist(product.id)} 
                  >
                    <Favorite color={product.isWishlisted === true ? "error" : "primary"} />
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
