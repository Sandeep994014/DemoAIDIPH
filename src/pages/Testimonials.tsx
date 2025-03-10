import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, Typography, Box } from '@mui/material';

interface ItemProps {
  name: string;
  description: string;
  image: string;
}

const carouselItems: ItemProps[] = [
  { name: 'Professional Shoes', description: 'High-quality, comfortable running shoes designed for professionals.', image: 'https://run-cdn.outsideonline.com/wp-content/uploads/2023/12/hottest-running-shoes-2024.png?.quality=50&strip=all&w=1200' },
  { name: 'Premium Headphones', description: 'Top-of-the-line noise-cancelling headphones for an immersive audio experience.', image: 'https://www.beatcurry.com/wp-content/uploads/2023/08/Article-05-Most-Expensive-Headphones.jpg' },
  { name: 'Advanced Mobile Phone', description: 'The latest smartphone with cutting-edge technology and features.', image: 'https://www.91-cdn.com/hub/wp-content/uploads/2024/09/iPhone-16-Pro-1024x576.jpg' },
];

const CarouselExample = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', py: 4 }}>
      <Carousel animation="slide" sx={{ height: 500 }}>
        {carouselItems.map((item, index) => (
          <Paper key={index} sx={{ position: 'relative', borderRadius: 2, boxShadow: 3, overflow: 'hidden', transition: 'transform 0.5s ease-in-out', height: '100%' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                color: 'white',
                textAlign: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {item.description}
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Learn More
              </Button>
            </Box>
          </Paper>
        ))}
      </Carousel>
    </Box>
  );
};

export default CarouselExample;
