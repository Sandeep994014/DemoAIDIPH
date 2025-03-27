import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Divider, Avatar, styled, Button } from '@mui/material';
import { profileUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; 
const StyledCard = styled(Card)(() => ({
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
}));
const StyledAvatar = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  margin: '0 auto',
  backgroundColor: '#3f51b5',
  fontSize: '2.5rem',
  marginBottom: '15px',
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
}));
const HeroBanner = () => {
  const [profile, setProfile] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [authToken, setAuthToken] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken'); 
      if (token) {
        setAuthToken(token);
        const decodedToken = jwtDecode(token); 
        setUserId(decodedToken.userId); 
      }
    };
    initializeAuth();
  }, []); 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileUser(authToken, userId);
        setProfile(data);
        setHasFetched(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    if (authToken && userId && !hasFetched) {
      fetchProfile();
    }
  }, [authToken, userId, hasFetched]);
  if (!profile) {
    return <Typography align="center">Loading...</Typography>;
  }
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <Box sx={{ padding: '20px', backgroundColor: '', minHeight: 'auto' }}>
      <Grid container spacing={4}>
        {}
        <Grid item xs={12} md={4}>
          <StyledCard sx={{ bgcolor: '#f5f5f5',}}>
            <CardContent >
              <StyledAvatar alt="User Avatar">{profile.firstName?.[0] || 'U'}</StyledAvatar>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                <strong>Points:</strong> {profile.points || 0}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <StyledButton variant="outlined" onClick={() => handleNavigation('/wishlist')}>
                  WishList
                </StyledButton>
                <StyledButton variant="outlined" onClick={() => handleNavigation('/order-history')}>
                  Order History
                </StyledButton>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        {}
        <Grid item xs={12} md={8}>
          <StyledCard sx={{ height: '100%' , bgcolor: '#f5f5f5', }}>
            <Grid container spacing={4} sx={{ height: '100%' }}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Welcome to Our Store
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  Discover the best products at unbeatable prices.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                   
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.5s ease',
                  }}
                >
                  <img src="https://www.apple.com/v/airpods/x/images/overview/airpods_max_purple__d9y3g3n7cnyq_large.png" alt="Product"
  style={{ width: '80%', borderRadius: '12px' }}
/>

                </Box>
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};
export default HeroBanner;