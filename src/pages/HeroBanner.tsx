import React from 'react';
import { Box, Button, Grid, Typography, styled } from '@mui/material';

const HeroCard = styled(Box)({
    paddingBottom: 4,
  flexGrow: 1,
  padding: 4,
  backgroundColor: '#f5f5f5',
  width: '100%',
  height: '50vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 
});

const HeroBanner = () => {
  return (
    <HeroCard>
      <Grid container spacing={2} >
        <Grid item xs={12} md={6}>
          <Typography variant="h2" alignItems="center">
            Welcome to Our Store
          </Typography>
          <Typography variant="h6" alignItems="center">
            Discover the best products at unbeatable products.
          </Typography>
         <Grid   sx={{ marginRight: 2 , marginTop: 5 }}>
         <Button variant="outlined" >
            Shop Now
          </Button>
          <Button variant="outlined"
          sx={{ marginLeft: 2  ,
            '&:hover': {
              backgroundColor: 'lightwhite',
            },
          }}>
            Create Account
          </Button>
         </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
           sx={{ display: 'flex', 
           justifyContent: 'center',
           alignItems: 'center' ,
           '&:hover': { transform: 'scale(1.5)' },
            transition: 'transform 0.5s ease',
             }}>

            <img src="https://www.boat-lifestyle.com/cdn/shop/products/0cfa4417-0213-4b49-b78e-0ae68aeb7057_600x.png?v=1625046144" alt="headphone" style={{ width: '60%' }} />
          </Box>
        </Grid>
      </Grid>
    </HeroCard>
  );
};

export default HeroBanner;
