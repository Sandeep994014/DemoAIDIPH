import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/auth';
import { Card, CardContent, CardMedia, Grid, Typography, Box, Paper ,Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, Link } from 'react-router-dom';

export default function History() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrderHistory = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('No authorization token found. Please log in again.');
        return;
      }

      const data = await getOrderHistory(authToken);
      setOrderHistory(data);
    } catch (err) {
      setError('Failed to fetch order history.');
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e3b55', mt: '2' }}>
      <Box sx={{ textAlign: 'center' }}>
  <Grid container spacing={2}>
    
    <Grid item xs={2} sx={{ textAlign: 'left' }}>
      <Typography variant="h6">
      <Button
          variant=""
          color="primary"
          component={Link}
          to="/"
          sx={{ alignItems: 'left' }}
        >
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          Continue Shopping
        </Button>
      </Typography>
    </Grid>

    
    <Grid item xs={6} sx={{ textAlign: 'center' }}>
      <Typography variant="h3">Order History</Typography>
     
    </Grid>
  </Grid>
</Box>
      </Typography>
      <Grid container spacing={4} mt={3}>
        {orderHistory.length > 0 ? (
          orderHistory.map((order) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={order.orderId}>
              <Paper elevation={3} sx={{
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                },
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}>
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444' }}>
                    Order ID: {order.orderId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Total Points: {order.totalPoint}
                  </Typography>
                </CardContent>
                <Box sx={{ padding: '0 16px 16px' }}>
                  {order.orderItems.map((item) => (
                    <Card key={item.orderItemId} sx={{ marginBottom: 2, borderRadius: '8px' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.productDescription}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                          Points per Item: {item.point}
                        </Typography>
                      </CardContent>
                      {/* <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
                        {item.imageUrls.map((image, index) => (
                          <CardMedia
                            key={index}
                            component="img"
                            alt={item.productName}
                            image={image}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1,
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                        ))}
                      </Box> */}
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: '#888' }}>No orders found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
