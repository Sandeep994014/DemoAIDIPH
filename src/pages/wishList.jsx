import React, { useEffect, useState, useRef } from 'react';
import { getWishlist, toggleWishlist, getProductById } from '../services/auth';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Grid, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useFavorites } from '../contexts/FavoritesContext';
import { toast, ToastContainer } from 'react-toastify';

export default function WishList() {
  const { addToFavorites, removeFromFavorites } = useFavorites();
  const [wishlist, setWishlist] = useState([]);
  console.log("wishlist from wishlist page ",wishlist);
  const [wishlistStatus, setWishlistStatus] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const effectRan = useRef(false); // Prevent double API call in Strict Mode

 
   const fetchWishlist = async () => {
     const authToken = localStorage.getItem('authToken');
     if (!authToken) return;
 
     try {
       const data = await getWishlist(authToken);
       setWishlist(data);
     } catch (error) {
       console.error( error.response?.data?.message);
     }
   };
 
   useEffect(() => {
     fetchWishlist();
   }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchWishlist();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in first.');
        return;
      }

      await toggleWishlist(product.productId, token);

      setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== product.productId));
      setWishlistStatus(prevStatus => {
        const newStatus = new Set(prevStatus);
        newStatus.delete(product.productId);
        return newStatus;
      });
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleProductClick = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const productDetails = await getProductById(productId, null, token);
      setSelectedProduct(productDetails);
      setOpenDialog(true);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button variant="" color="primary" component={Link} to="/">
        <ArrowBackIosIcon sx={{ mr: 1 }} />
        Continue Shopping
      </Button>

      <Typography variant="h4" textAlign={'center'} fontWeight={600} sx={{ mb: 4, textDecoration: 'underline' }}>
        My Wishlist
      </Typography>

      <Typography variant="h6" gutterBottom textAlign={"center"}>
        Items in Wishlist ({wishlist.length})
      </Typography>

      {wishlist.length > 0 ? (
        <Grid container spacing={4} mt={3}>
          {wishlist.map((product) => (
            <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3} mt={3}>
              <Card sx={{ maxWidth: 345 }} onClick={() => handleProductClick(product.productId)}>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    sx={{
                      color: wishlistStatus.has(product.productId) === true ? 'red' : 'red',
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
      <ToastContainer/>
    </Box>
  );
}
