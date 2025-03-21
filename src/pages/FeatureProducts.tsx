import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getProducts, addToCart, toggleWishlist } from '../services/auth';  
import { useAuth } from '../auth/AuthContext';

export default function FeatureProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState({}); 
  const [wishlist, setWishlist] = useState({});  // State to track wishlist status of products
  const { userId, authToken } = useAuth(); 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await getProducts(userId);
        setProducts(Array.isArray(productsData?.content) ? productsData.content : []);
        setError(null);
        const initialSizeSelection = {};
        productsData?.content.forEach((product) => {
          const firstVariant = product.productVariants[0];
          initialSizeSelection[product.id] = firstVariant; 
        });
        setSelectedSize(initialSizeSelection);
        
        // Initialize wishlist state with product IDs and their wishlist status
        const initialWishlist = {};
        productsData?.content.forEach((product) => {
          initialWishlist[product.id] = product.isInWishlist || false;  // Assuming `isInWishlist` is provided in the API
        });
        setWishlist(initialWishlist);
        
      } catch (error) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProducts();
    }
  }, [userId]);

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
  
    try {
      const response = await addToCart(product.id, quantity, authToken);
      setCartSuccess("Product added to cart successfully!");
      setCartError("");  
      alert(response.data.message);  
    } catch (error) {
      // setCartSuccess("");  
      alert("Product added successfully"); 
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const response = await toggleWishlist(productId, authToken);
      setWishlist(prevState => ({
        ...prevState,
        [productId]: !prevState[productId],  // Toggle wishlist status
      }));
      console.log(response.message);  // Show success message
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
                image={
                  selectedSize[product.id]
                    ? selectedSize[product.id]?.imageUrls[0]  
                    : (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.jpg')  
                }
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
  <BookmarkIcon sx={{ color: wishlist[product.id] ? "red" : "gray" }} />
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
