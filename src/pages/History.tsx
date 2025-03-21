import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/auth';
import { Card, CardContent, CardMedia, Grid, Typography, Box } from '@mui/material';

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
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      <Grid container spacing={4}>
        {orderHistory.length > 0 ? (
          orderHistory.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.orderId}>
              <Card sx={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3,
                }
              }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {order.orderId}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body1">
                    Total Points: {order.totalPoint}
                  </Typography>
                </CardContent>
                <Box sx={{ padding: '0 16px 16px' }}>
                  {order.orderItems.map((item) => (
                    <Card key={item.orderItemId} sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{item.productName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.productDescription}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          Points per Item: {item.point}
                        </Typography>
                      </CardContent>
                      <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
                        {item.imageUrls.map((image, index) => (
                          <CardMedia
                            key={index}
                            component="img"
                            alt={item.productName}
                            image={image}
                            sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No orders found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
