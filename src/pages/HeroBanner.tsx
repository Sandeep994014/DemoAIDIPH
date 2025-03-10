import React from 'react';
import { Box, Button, Grid, Typography, styled } from '@mui/material';

const FullWidthBox = styled(Box)({
    paddingBottom: 4,
  flexGrow: 1,
  padding: 4,
  backgroundColor: '#f5f5f5',
  width: '100%',
  height: '50vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
});

const HeroBanner = () => {
  return (
    <FullWidthBox>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" gutterBottom>
            Welcome to Our Store
          </Typography>
          <Typography variant="h6" gutterBottom>
            Discover the best products at unbeatable products.
          </Typography>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Shop Now
          </Button>
          <Button variant="outlined" color="primary">
            Create Account
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzcDujPahr6CKX16ckpadQFsW668f8N0ll6g&s" alt="Product 1" style={{ width: '30%', marginRight: '10px' }} />
            <img src="https://cdn.thewirecutter.com/wp-content/media/2023/07/bluetoothheadphones-2048px-0876.jpg?auto=webp&quality=75&width=1024" alt="Product 2" style={{ width: '30%', marginRight: '10px' }} />
            <img src="https://www.boat-lifestyle.com/cdn/shop/products/0cfa4417-0213-4b49-b78e-0ae68aeb7057_600x.png?v=1625046144" alt="Product 3" style={{ width: '30%' }} />
          </Box>
        </Grid>
      </Grid>
    </FullWidthBox>
  );
};

export default HeroBanner;
