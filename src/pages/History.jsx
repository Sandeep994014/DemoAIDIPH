import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/auth';
import { Grid, Typography, Box, Paper, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
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
      const sortedOrders = data
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) 
        .sort((a, b) => b.orderId - a.orderId); 
      setOrderHistory(sortedOrders);
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
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500'; 
      case 'APPROVED':
        return '#4CAF50'; 
      case 'REJECTED':
        return '#F44336'; 
      default:
        return '#000'; 
    }
  };
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
      {}
      {orderHistory.length > 0 ? (
        orderHistory.map((order) => (
          <Box key={order.orderId} sx={{ mt: 3 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              {}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: 2,
                  color: getStatusColor(order.status), 
                }}
              >
                Order Status: {order.status}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Order ID: {order.orderId}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Total Points: {order.totalPoint}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {}
                    {}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Order Items
                </Typography>
                <Grid container spacing={2}>
                  {order.orderItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.orderItemId}>
                      <Paper
                        elevation={1}
                        sx={{
                          padding: 2,
                          borderRadius: 2,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
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
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Box>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#888' }}>
          No orders found.
        </Typography>
      )}
    </Box>
  );
}