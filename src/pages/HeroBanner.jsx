import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Divider, Avatar, styled, Button } from '@mui/material';
import { profileUser } from '../services/auth';  
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../auth/AuthContext';  


const HeroCard = styled(Box)(() => ({
  padding: '20px',
  backgroundColor: '#f5f5f5',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const LeftCard = styled(Card)(() => ({
  width: '100%',
  padding: '20px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  marginRight: '20px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
}));

const AvatarStyled = styled(Avatar)(() => ({
  width: '80px',
  height: '80px',
  margin: '0 auto',
  backgroundColor: '#3f51b5',
  fontSize: '2rem',
  marginBottom: '10px',
}));


const ButtonContainer = styled(Box)(() => ({
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, 
    color: 'white',
  },
  '&.MuiButton-outlined': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const HeroBanner = () => {
  const [profile, setProfile] = useState(null);  
  const { userId, authToken } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileUser(authToken, userId); 
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (authToken && userId) {
      fetchProfile();
    }
  }, [authToken, userId]); 

  if (!profile) {
    return <Typography align="center">Loading...</Typography>; 
  }

  const handleNavigation = (path) => {
    navigate(path); 
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '50vh' }}>
      
      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LeftCard>
          <CardContent>
      
            <AvatarStyled alt="User Avatar">{profile.firstName?.[0] || 'U'}</AvatarStyled>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '10px' }}>
              {profile.email}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              <strong>Points:</strong> {profile.points || 0}
            </Typography>
           
            <ButtonContainer sx={{ marginY: 10 }}>
              <StyledButton variant="outlined" onClick={() => handleNavigation('/wishlist')}>
                WishList
              </StyledButton>
              <StyledButton variant="outlined" onClick={() => handleNavigation('/order-history')}>
                Order History
              </StyledButton>
            </ButtonContainer>
          </CardContent>
        </LeftCard>
      </Grid>

      {/* Right Card (Hero Section) */}
      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <HeroCard>
          <Grid container spacing={4} sx={{ height: '100%' }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" align="center" sx={{ marginBottom: 2 }}>
                Welcome to Our Store
              </Typography>
              <Typography variant="h6" align="center" sx={{ marginBottom: 3 }}>
                Discover the best products at unbeatable prices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': { transform: 'scale(1.2)' },
                  transition: 'transform 0.5s ease',
                }}
              >
                <img
                  src="https://www.boat-lifestyle.com/cdn/shop/products/0cfa4417-0213-4b49-b78e-0ae68aeb7057_600x.png?v=1625046144"
                  alt="headphone"
                  style={{ width: '80%' }}
                />
              </Box>
            </Grid>
          </Grid>
        </HeroCard>
      </Grid>
    </Box>
  );
};

export default HeroBanner;
