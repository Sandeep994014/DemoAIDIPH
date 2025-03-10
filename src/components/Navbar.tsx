import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Container, Box } from '@mui/material';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const sidebarRef = useRef(null);

  // Function to handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle product count increase
  const increaseProductCount = () => {
    setProductCount(productCount + 1);
  };

  // Function to handle product count decrease
  const decreaseProductCount = () => {
    if (productCount > 0) {
      setProductCount(productCount - 1);
    }
  };

  // Close the sidebar if clicked outside of the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close sidebar and proceed to checkout when the button is clicked
  const handleProceedToCheckout = () => {
    setIsSidebarOpen(false); // Close the sidebar immediately
    // You can add more logic for proceeding to checkout here if needed
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'RGB(113, 101, 239)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
              Demo AIDIPH
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button component={Link} to="/" sx={{ color: 'white' }}>
                Home
              </Button>
              <Button component={Link} to="/products" sx={{ color: 'white' }}>
                Shop
              </Button>
            </Box>
            <IconButton component={Link} to="#" sx={{ color: 'white' }} onClick={toggleSidebar}>
              <Badge badgeContent={productCount} color="secondary">
                <Favorite />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="#" sx={{ color: 'white' }} onClick={toggleSidebar}>
              <Badge badgeContent={productCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Button component={Link} to="/login" sx={{ color: 'white', ml: 1 }}>
              Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {isSidebarOpen && (
  <Box
    ref={sidebarRef}
    sx={{
      padding: '20px',
      position: 'fixed',
      right: 0,
      top: 0,
      width: '400px',
      height: '100%',
      backgroundColor: 'white',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
      zIndex: 1300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    {/* Sidebar content */}
    <Box sx={{ flexGrow: 1 }}>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
    Shopping Cart
  </Typography>

  {/* Counter to increase or decrease product count */}
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '10px' }}>
    
    {/* Product Image */}
    <Box sx={{ mr: 2 }}>
      <img 
        src="https://cdn3.pixelcut.app/7/10/ai_background_1_5b79cd8ea3_1ea97b2c5a.jpg" // Replace with your actual image URL or dynamic product image
        alt="Product"
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
      />
    </Box>
    
    {/* Counter Buttons */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button variant="outlined" onClick={decreaseProductCount} sx={{ marginRight: 1 }}>
        -
      </Button>
      <Typography variant="body1" sx={{ mx: 2 }}>
        {productCount}
      </Typography>
      <Button variant="outlined" onClick={increaseProductCount} sx={{ marginLeft: 1 }}>
        +
      </Button>
    </Box>
  </Box>

  {/* Total Items Section */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
    <Typography variant="body2" color="textSecondary">
      Total Items
    </Typography>
    <Typography variant="h6" fontWeight="bold">
      {productCount}
    </Typography>
  </Box>
</Box>


    {/* Proceed button at the bottom */}
    <Button
      variant="contained"
      color="primary"
      sx={{
        width: '100%',
        padding: '16px',
        backgroundColor: 'RGB(113, 101, 239)',
        '&:hover': {
          backgroundColor: 'RGB(97, 86, 196)', // Lighter hover color for a better effect
        },
      }}
      component={Link}
      to="/checkout"
      onClick={handleProceedToCheckout} // Close sidebar on button click
    >
      Proceed to Checkout
    </Button>
  </Box>
)}

    </>
  );
}
