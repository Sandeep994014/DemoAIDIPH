import React, { useEffect, useState } from 'react';
import { getWishlist, toggleWishlist, getProductById } from '../services/auth';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Grid, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function WishList() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState(new Set()); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [openDialog, setOpenDialog] = useState(false); 

  // Fetch wishlist from the backend
  const fetchWishlist = async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const data = await getWishlist(authToken);
        console.log("Wishlist Data:", data);
        setWishlist(data);

       
        const productIds = new Set(data.map(product => product.productId));
        console.log("Wishlist Status:", productIds);
        setWishlistStatus(productIds); 
      } catch (error) {
        alert(error.response?.data?.message || 'Error fetching wishlist');
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  
  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in first.');
        return;
      }

      
      await toggleWishlist(product.productId, token);

    
      fetchWishlist();

    } catch (error) {
      alert(error.response?.data?.message || 'Error updating wishlist');
    }
  };

  // Function to fetch product details when a user clicks on a product
  const handleProductClick = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const productDetails = await getProductById(productId, null, token); 
      setSelectedProduct(productDetails); 
      setOpenDialog(true); 
    } catch (error) {
      console.log(error.response?.data?.message );
    }
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button
  variant=""
  color="primary"
  component={Link}
  to="/"
  sx={{  alignItems: 'left' }}
>
  <ArrowBackIosIcon sx={{ mr: 1 }} />
  Continue Shopping
</Button>


      <Typography variant="h4" textAlign={'center'} fontWeight={600} sx={{ mb: 4, textDecoration: 'underline' }}>
        My Wishlist
      </Typography>

      {wishlist.length > 0 ? (
        <Grid container spacing={4}>
          {wishlist.map((product) => (
            <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: 345 }} onClick={() => handleProductClick(product.productId)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imageUrls[0]}  // Assuming the imageUrls is an array
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
                    onClick={(e) => { 
                      e.stopPropagation();  // Prevent the click from triggering the product detail dialog
                      handleToggleWishlist(product);  // Toggle wishlist status for this product
                    }}
                    sx={{
                      color: wishlistStatus.has(product.productId) ? 'red' : 'gray',  // Red if in wishlist, gray otherwise
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

      {/* Dialog to show product details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? selectedProduct.name : ''}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedProduct ? selectedProduct.description : ''}</Typography>
          <Typography variant="h6">{selectedProduct ? selectedProduct.point : ''}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
