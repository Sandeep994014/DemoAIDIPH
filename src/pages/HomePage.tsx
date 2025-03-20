import React from 'react';
import { Container, Box } from '@mui/material';
import HeroBanner from '../pages/HeroBanner';
import FeatureProducts from '../pages/FeatureProducts';

export default function HomePage() {
  return (
    <Container>
      <HeroBanner />
      <Box my={4}>
        <FeatureProducts />
      </Box>
    </Container>
  );
}


