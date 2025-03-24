import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, Grid, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAddress, updateAddress, checkoutOrder, fetchCart } from '../services/auth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';

const Delivery = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false); 
  const [points, setPoints] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchUserPoints = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const response = await profileUser(authToken);
      console.log("User Points:", response);
      setPoints(response?.points);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  const fetchAddresses = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return;
    }
    try {
      const addressData = await getAddress(authToken);
      console.log("address", addressData);
      setAddresses(addressData);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [navigate]);

  const cartItems = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const cartData = await fetchCart(authToken);
      const arr = cartData?.products?.map(product => ({
        id: product.productId,
        name: product.productName,
        size: product.variants[0].size,
        quantity: product.variants[0].quantity,
        points: product.variants[0].point,
        totalPoints: product.variants[0].totalPoint,
        price: product.variants[0].price, 
        image: product.variants[0].imageUrls[0] || "/placeholder.svg"
      }));
      setCart(arr);
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  useEffect(() => {
    cartItems();
  }, []);

  useEffect(() => {
    setCartTotal(cart.reduce((acc, product) => acc + product.price * product.quantity, 0));
    setTotalPoints(cart.reduce((acc, product) => acc + product.points * product.quantity, 0));
    setTotalProducts(cart.reduce((acc, product) => acc + product.quantity, 0));
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setForm({
      street: address.street1,
      city: address.city,
      state: address.state,
      zip: address.zip
    });
    setOpenEditDialog(true); 
  };

  // Close modal
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateAddress = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('No authentication token found.');
      return;
    }

    try {
      const updatedAddress = {
        ...editingAddress,
        street1: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip
      };

      await updateAddress(updatedAddress, authToken); 
      fetchAddresses(); 
      setOpenEditDialog(false); 
    } catch (error) {
      console.error('Failed to update address:', error);
      alert(error.response?.data?.message || 'Error updating address.');
    }
  };

  const handleToggleDefault = async (addressId) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return;
    }

    try {
      const updatedAddresses = addresses.map((address) =>
        address.id === addressId
          ? { ...address, isDefault: !address.isDefault }
          : { ...address, isDefault: false }
      );
      setAddresses(updatedAddresses);

      const updatedAddress = updatedAddresses.find((address) => address.id === addressId);
      await updateAddress(updatedAddress, authToken);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleCardClick = (selectedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === selectedAddress.id
        ? { ...address, isDefault: true }
        : { ...address, isDefault: false }
    );
    setAddresses(updatedAddresses);

    // Update the selected address on the server
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const updatedAddress = updatedAddresses.find((address) => address.id === selectedAddress.id);
      updateAddress(updatedAddress, authToken);
    }
  };

  const handleCheckout = async () => {
    const authToken = localStorage.getItem('authToken');
    const employeeId = authToken; 

    if (!authToken || !employeeId) {
      console.error('Auth token or employeeId missing');
      return;
    }

    console.log("Sending checkout request with token:", authToken);
    try {
      const response = await checkoutOrder(employeeId, authToken);
      console.log("Checkout Response:", response);
      if (response.message === 'Order placed successfully.') {
        alert("Order placed successfully!");
        navigate("/order-history");
      } else {
        alert(response?.data?.message);
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e3b55', mt: '2' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={2} sx={{ textAlign: 'left' }}>
              <Typography variant="h6">
                <Button
                  variant=""
                  color="primary"
                  component={Link}
                  to="/cart"
                  sx={{ alignItems: 'left' }}
                >
                  <ArrowBackIosIcon sx={{ mr: 1 }} />
                  Go Back
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <Typography variant="h3">Order </Typography>
            </Grid>
          </Grid>
        </Box>
      </Typography>

      {/* Address Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box sx={{ border: 1, borderRadius: 1, p: 6, bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Delivery Address
            </Typography>
            <Box display="flex" justifyContent="flex-start" alignItems="flex-start" padding={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                component={Link}
                to="/address"
              >
                Add New Address
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select where you want your items delivered
            </Typography>
            <Typography variant="h6">Addresses</Typography>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    border: address.isDefault ? '2px solid #4caf50' : '1px solid #ddd',
                    bgcolor: address.isDefault ? '#f0f8e6' : 'background.paper'
                  }}
                  onClick={() => handleCardClick(address)}
                >
                  <CardContent>
                    <Typography variant="body1">{address.street1}</Typography>
                    <Typography variant="body1">{address.city}, {address.state} {address.zip}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEditClick(address)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No addresses found.</Typography>
            )}
          </Box>
        </Box>

        {/* Order Summary */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ border: 1, borderRadius: 2, p: 4, bgcolor: 'background.paper', boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Order Summary
            </Typography>

            {/* Product Information */}
            <Box sx={{ mb: 3 }}>
              {cart.length > 0 ? (
                cart.map((product, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {product.name} (Size: {product.size})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {product.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Points per product: {product.points}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Total Points: {product.totalPoints}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No products found in cart.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
              <strong>Total Points :</strong> {totalPoints}
            </Typography>

            <Button
              variant="contained"
              onClick={handleCheckout}
              sx={{ mt: 3, width: '100%', borderRadius: 2, py: 1 }}
            >
              Place Order
            </Button>
          </Card>
        </Box>
      </Box>

      {/* Edit Address Modal */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            label="Street"
            name="street"
            value={form.street}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ZIP"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAddress} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Delivery;
