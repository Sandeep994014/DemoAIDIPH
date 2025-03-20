import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, styled, IconButton, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getProducts, addToCart as addToCartService, toggleWishlist } from '../services/auth';

const FeatureCard = styled(Card)({
  height: 520,
  maxWidth: 345,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(0.1',
  },
});

const FeatureCardMedia = styled(CardMedia)({
  height: 250,
});

const FeatureProducts = () => {
  const { addToCart } = useCart();
  const { addToFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // console.log("Making API call to fetch products...");
        const data = await getProducts(1, 1, 10, token); 
        // console.log("Product data fetched", data);
        setProducts(data?.content);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Unauthorized access. Please log in again.');
        } else {
          alert('Failed to fetch products', error);
        }
      }
    };

    fetchProducts();
  }, []);

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants(prevState => ({
      ...prevState,
      [productId]: variantId
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      await addToCartService(product.id, 1, token);
      addToCart(product);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      await toggleWishlist(product.id, token);
      addToFavorites(product);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4, textDecoration: 'underline' }}>Feature Products</Typography>
      <Grid container spacing={4}>
        {products.map(product => {
          const selectedVariant = product.productVariants.find(variant => variant.id === selectedVariants[product.id]) || product.productVariants[0];
          return (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <FeatureCard>
                <FeatureCardMedia
                  image={selectedVariant.imageUrls[0]}
                  title={product.name}
                />
                <CardContent sx={{ textAlign: 'start' }}>
                  <Typography variant="h6" component="div" fontWeight={600}> <span>{product.brand}</span> {product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Points: {product.point}</Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {product.productVariants.map(variant => (
                      <Button
                        key={variant.id}
                        variant="contained"
                        sx={{
                          backgroundColor: variant.color.toLowerCase(),
                          minWidth: 30,
                          height: 30,
                          borderRadius: '50%',
                          '&:hover': {
                            backgroundColor: variant.color.toLowerCase(),
                          }
                        }}
                        onClick={() => handleVariantChange(product.id, variant.id)}
                      />
                    ))}
                  </Box>
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel>Variant</InputLabel>
                    <Select
                      value={selectedVariant.id}
                      onChange={(e) => handleVariantChange(product.id, e.target.value)}
                      label="Variant"
                    >
                      {product.productVariants.map(variant => (
                        <MenuItem key={variant.id} value={variant.id}>
                          {variant.color} - {variant.size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                  <IconButton aria-label="add to favorites" onClick={() => handleToggleWishlist(product)}>
                    <FavoriteIcon />
                  </IconButton>
                  <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                    <ShoppingBag sx={{ fontSize: 18, ml: 1 }} />
                  </Button>
                </Box>
              </FeatureCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default FeatureProducts;
