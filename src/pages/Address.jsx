import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from 'react-router-dom';
import { addAddress, updateAddress } from '../services/auth'; 
export default function Address() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [editingAddress, setEditingAddress] = useState(null); 
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
      navigate('/delivery'); 
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred while saving the address.');
    }
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h6">
        <Button
          variant=""
          color="primary"
          component={Link}
          to="/delivery"
          sx={{ alignItems: 'left' }}
        >
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          Go Back
        </Button>
      </Typography>
      <Typography variant="h4" sx={{ textAlign: 'center', my: 3 }}>
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Street Address"
          name="street"
          value={form.street}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="ZIP Code"
          name="zip"
          value={form.zip}
          onChange={handleChange}
          fullWidth
        />
        {}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: '100%', borderRadius: 2, py: 1 }}
          >
            {editingAddress ? 'Update Address' : 'Add Address'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}