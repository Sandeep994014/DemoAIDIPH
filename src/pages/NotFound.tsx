import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container sx={{ textAlign: 'center', marginTop: '2rem' ,color: 'red' }}>
      <Typography variant="h3" component="h1" >
        404 - Page Not Found
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/" sx={{
        marginTop: '1rem'
      }}>
        <ArrowBack/> &nbsp; <span> Go to Home </span>
      </Button>
    </Container>
  );
};

export default NotFound;
