import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Container sx={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
          Oops! It looks like the page you're looking for doesn't exist.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/" 
          sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowBack sx={{ marginRight: '8px' }} />
          Go to Home
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
