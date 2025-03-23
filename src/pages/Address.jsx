import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from 'react-router-dom';
import { addAddress, updateAddress } from '../services/auth'; // Ensure this path is correct

export default function Address() {
  const navigate = useNavigate();
  
  // Form state to store address data
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [editingAddress, setEditingAddress] = useState(null); // Track if we're editing an existing address

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return;
    }

    try {
      const addressData = {
        name: 'User Name', // You can fetch the user's name or prompt them to enter it
        street1: form.street,
        street2: '',
        city: form.city,
        state: form.state,
        country: 'Country', // You can update this to dynamically fetch the user's country if needed
        zip: form.zip,
        phone: 'Phone Number', // Similarly, you can add a phone input field if needed
        isDefault: true, // This can be toggled if needed, or you can let the user choose
        isDeleted: false
      };

      if (editingAddress) {
        await updateAddress(addressData, authToken);
      } else {
        await addAddress(addressData, authToken);
      }

      // Navigate back after submission or show a success message
      navigate('/delivery'); // Redirect to the delivery page or wherever appropriate
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
        
        {/* You can add more fields here (like Phone, Country, etc.) if needed */}

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
