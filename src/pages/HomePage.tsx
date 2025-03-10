import React from 'react';
import Layout from '../components/Layout';
import { Container, Box } from '@mui/material';
import HeroBanner from '../pages/HeroBanner';
import FeatureProducts from '../pages/FeatureProducts';
import Testimonials from '../pages/Testimonials';

export default function HomePage() {
  return (
    // <Layout>
      <Container>
        <HeroBanner />
        <Box my={4}>
          <FeatureProducts />
        </Box>
        <Box my={4}>
          <Testimonials />
        </Box>
      </Container>
    // </Layout>
  );
}


