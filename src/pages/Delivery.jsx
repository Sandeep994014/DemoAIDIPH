import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, Grid, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAddress, updateAddress, checkoutOrder, fetchCart } from '../services/auth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode'; // Ensure this import is present

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
      const decode = jwt_decode(authToken);
      const userId = decode.userId;
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const response = await profileUser(authToken,userId);
      console.log("User Points:", response);
      setPoints(response?.points);
    } catch (error) {
      toast.error(error.response.data.message);
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
      toast.error('No authentication token found.');
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
      toast.success('Address updated successfully.');
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error(error.response?.data?.message || 'Error updating address.');
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
      toast.success('Default address updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating default address.');
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
    if (!authToken) {
      console.error('Auth token missing');
      toast.error('Authentication token is missing.');
      return;
    }

    try {
      const decode = jwt_decode(authToken);
      const userId = decode.userId; // Decode userId from the token

      // Find the default address
      const defaultAddress = addresses.find((address) => address.isDefault);
      if (!defaultAddress) {
        toast.error(error?.response?.data?.message );
        return;
      }

      const addressId = defaultAddress.id; // Get the selected address ID

      const response = await checkoutOrder(userId, addressId, authToken); // Pass userId as employeeId
      console.log("Checkout Response:", response.message);
      if (response.message === 'Order placed successfully.') {
        toast.success( 'Order placed successfully.');
        setTimeout(() => {
          navigate("/order-history");
        }, 2000);
      } else {
        toast.error(response?.data?.message || 'Error during checkout.');
      }
    } catch (error) {
 
      toast.error(error?.response?.message);
    }
  };

  return (
    <Box sx={{ padding: 4, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
       <Button variant="" color="primary" component={Link} to="/cart">
        <ArrowBackIosIcon sx={{ mr: 1 }} />
        Continue Shopping
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e3b55', textAlign: 'center', mb: 4 }}>
        Order Delivery
      </Typography>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Grid container spacing={4} mt={1}>
        {/* Address Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Delivery Address
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/address"
              sx={{ mb: 3, display: 'flex', }}
            >
              Add New Address
            </Button>
            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
              Select where you want your items delivered
            </Typography>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    border: address.isDefault ? '2px solid #4caf50' : '1px solid #ddd',
                    bgcolor: address.isDefault ? '#f0f8e6' : 'background.paper',
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => handleCardClick(address)}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{address.street1}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {address.city}, {address.state} {address.zip}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEditClick(address)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>No addresses found.</Typography>
            )}
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Order Summary
            </Typography>
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
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>No products found in cart.</Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 1 }}>
              Total Points: {totalPoints}
            </Typography>
            <Button
              variant="contained"
              onClick={handleCheckout}
              sx={{ mt: 3, width: '100%', borderRadius: 2, py: 1 }}
            >
              Place Order
            </Button>
          </Card>
        </Grid>
      </Grid>

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
      <ToastContainer />
    </Box>
  );
};

export default Delivery;
