import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function SideBar() {
  const [productCount, setProductCount] = useState(1);

  const increaseProductCount = () => {
    setProductCount(productCount + 1);
  };

  const decreaseProductCount = () => {
    if (productCount > 1) {
      setProductCount(productCount - 1);
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Shopping Cart
        </Typography>
        {/* Counter to increase or decrease product count */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '10px' }}>
          {/* Product Image */}
          <Box sx={{ mr: 2 }}>
            <img 
              src="https://cdn3.pixelcut.app/7/10/ai_background_1_5b79cd8ea3_1ea97b2c5a.jpg" // Replace with your actual image URL or dynamic product image
              alt="Product"
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
            />
          </Box>
          {/* Counter Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" onClick={decreaseProductCount} sx={{ marginRight: 1 }}>
              -
            </Button>
            <Typography variant="body1" sx={{ mx: 2 }}>
              {productCount}
            </Typography>
            <Button variant="outlined" onClick={increaseProductCount} sx={{ marginLeft: 1 }}>
              +
            </Button>
          </Box>
        </Box>
        {/* Total Items Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Total Items
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {productCount}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
