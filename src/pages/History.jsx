import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/auth';
import { Grid, Typography, Box, Paper, Button, Divider, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

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
      const decode = jwt_decode(authToken);
      const userId = decode.userId; 
      console.log("userId", userId);
      const data = await getOrderHistory(authToken, userId);
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
    return <Typography sx={{ textAlign: 'center', color: 'red', mt: 4 }}>{error}</Typography>;
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
    <Box sx={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#2e3b55',
          textAlign: 'center',
          mb: 4,
          textTransform: 'uppercase',
        }}
      >
        Order History
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        startIcon={<ArrowBackIosIcon />}
        sx={{ mb: 4, textTransform: 'none' }}
      >
        Back to Home
      </Button>

      {orderHistory.length > 0 ? (
        orderHistory.map((order) => (
          <Paper
            key={order.orderId}
            elevation={3}
            sx={{
              padding: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Chip
                label={order.status}
                sx={{
                  backgroundColor: getStatusColor(order.status),
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Order ID: {order.orderId}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Total Points: {order.totalPoint}
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
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
                      backgroundColor: '#f9f9f9',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', mb: 1, color: '#2e3b55' }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {item.productDescription}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: '#3f51b5' }}
                    >
                      Points per Item: {item.point}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', color: '#888', mt: 4 }}
        >
          No orders found.
        </Typography>
      )}
    </Box>
  );
}