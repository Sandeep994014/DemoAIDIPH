import React, { useEffect, useState } from 'react';
import { getWishlist, toggleWishlist } from '../services/auth';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Grid, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Importing FavoriteIcon

export default function WishList() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const data = await getWishlist(authToken);
        setWishlist(data); // Set the fetched wishlist data to state
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchWishlist(); // Fetch wishlist data when component mounts
  }, []);

  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem('authToken');
      const updatedProduct = await toggleWishlist(product.id, token); // Call toggle API

      // If the product is toggled successfully, re-fetch the updated wishlist
      fetchWishlist();
    } catch (error) {
      alert(error.response.data.message); // Handle error properly
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4, textDecoration: 'underline' }}>
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
                  image={product.imageUrls}
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
                  <IconButton aria-label="add to favorites" onClick={() => handleToggleWishlist(product)}>
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Typography variant="h6">Your wishlist is empty</Typography>
          <Button variant="contained" color="primary" component={Link} to="/">
            Continue Shopping
          </Button>
        </>
      )}
    </Box>
  );
}
