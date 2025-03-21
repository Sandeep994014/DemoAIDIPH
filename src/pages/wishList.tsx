import React, { useEffect, useState } from 'react';
import { getWishlist, toggleWishlist, getProductDetails } from '../services/auth';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Grid, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import { useAuth } from '../auth/AuthContext'; // Assuming this hook provides the auth data

export default function WishList() {
  const { isAuthenticated, userId, authToken } = useAuth(); // Get user data from context
  const [wishlist, setWishlist] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState(new Set()); 
  const [productDetails, setProductDetails] = useState(null); // Store product details when fetched

  // Fetch the wishlist from the server
  const fetchWishlist = async () => {
    if (authToken) {
      try {
        const data = await getWishlist(authToken);
        setWishlist(data);

        const productIds = new Set(data.map(product => product.id));
        console.log("productIds", productIds);
        setWishlistStatus(productIds);
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [authToken]);

  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem('authToken');
      await toggleWishlist(product.id, token);

      setWishlistStatus(prevStatus => {
        const updatedStatus = new Set(prevStatus);
        if (updatedStatus.has(product.id)) {
          updatedStatus.delete(product.id); 
        } else {
          updatedStatus.add(product.id); 
        }
        return updatedStatus;
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleGetProductDetails = async (productId) => {
    try {
      // Fetch product details using the getProductDetails API
      const productDetails = await getProductDetails(productId, userId, authToken);
      setProductDetails(productDetails);
      console.log('Product Details:', productDetails);
      // You can now use `productDetails` for displaying more information if required
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button variant="contained" color="primary" component={Link} to="/">
        Continue Shopping
      </Button>

      <Typography variant="h4" textAlign={'center'} fontWeight={600} sx={{ mb: 4, textDecoration: 'underline' }}>
        My Wishlist
      </Typography>

      {wishlist.length > 0 ? (
        <Grid container spacing={4}>
          {wishlist.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imageUrls[0]}  
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h5">{product.brand} {product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="textPrimary">
                    {product.point}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    aria-label="toggle wishlist"
                    onClick={() => handleToggleWishlist(product)}
                    sx={{
                      color: wishlistStatus.has(product.id) ? 'red' : 'gray', 
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" textAlign={'center'}>Your wishlist is empty</Typography>
      )}

      {/* Optionally, render the product details if fetched */}
      {productDetails && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Product Details</Typography>
          <pre>{JSON.stringify(productDetails, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
