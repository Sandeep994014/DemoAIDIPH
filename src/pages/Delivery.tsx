import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Stack, Card, CardContent, CardActions, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addAddress, getAddress, updateAddress, checkoutOrder } from '../services/auth';
import { useCart } from '../contexts/CartContext';

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
  const [points, setPoints] = useState(0);

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
     alert(error.response.data.message);
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
      setAddresses(addressData);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return;
    }

    try {
      const addressData = {
        name: 'User Name',
        street1: form.street,
        street2: '',
        city: form.city,
        state: form.state,
        country: 'Country',
        zip: form.zip,
        phone: 'Phone Number',
        isDefault: true,
        isDeleted: false
      };

      if (editingAddress) {
        await updateAddress(addressData, authToken);
      } else {
        await addAddress(addressData, authToken);
      }
    } catch (error) {
      alert( error.response.data.message);
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
      alert( error.response.data.message);
    }
  };

  const handleCheckout = async () => {
    const authToken = localStorage.getItem('authToken');
    const employeeId = 1; 

    if (!authToken || !employeeId) {
      console.error('Auth token or employeeId missing');
      return;
    }

    console.log("Sending checkout request with token:", authToken);
    try {
      const response = await checkoutOrder(employeeId, authToken);
      console.log("Checkout Response:", response);
      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate.push("/order-History");
      } else {
       alert(error.response.data.message);
      }
    } catch (error) {
      alert( error.response.data.message);
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Delivery
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box sx={{ border: 1, borderRadius: 1, p: 6, bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom>
              Delivery Address
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select where you want your items delivered
            </Typography>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    border: address.isDefault ? '2px solid #4caf50' : '1px solid #ddd',
                    bgcolor: address.isDefault ? '#f0f8e6' : 'background.paper'
                  }}
                >
                  <CardContent>
                    <Typography variant="body1">{address.street1}</Typography>
                    <Typography variant="body1">{address.city}, {address.state} {address.zip}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setEditingAddress(address)}>
                      Edit
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" mr={2}> Default address</Typography>
                      <Switch
                        checked={address.isDefault}
                        onChange={() => handleToggleDefault(address.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Box>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No addresses found.</Typography>
            )}
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditingAddress(null)}>
              Add New Address
            </Button>
            <Box component="form" sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <TextField label="Street" name="street" value={form.street} onChange={handleChange} fullWidth />
                <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth />
                <TextField label="State" name="state" value={form.state} onChange={handleChange} fullWidth />
                <TextField label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} fullWidth />
                <Button variant="contained" onClick={handleSubmit}>
                  {editingAddress ? 'Update Address' : 'Save Address '}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Box sx={{ border: 1, borderRadius: 1, p: 6, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
            <Card sx={{ border: 1, borderRadius: 1, p: 6, bgcolor: 'background.paper' }}>
              <Button
                variant="contained"
                onClick={handleCheckout} >
                Checkout
              </Button>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Delivery;
