import React from 'react';
import { Container, Box } from '@mui/material';
import HeroBanner from './HeroBanner';
import FeatureProducts from './FeatureProducts';

export default function HomePage() {
  return (
    <Container fluid>
     <Box my={1}>
     <HeroBanner />
      </Box>
      <Box my={4}>
        <FeatureProducts />
      </Box>
    </Container>
  );
}


