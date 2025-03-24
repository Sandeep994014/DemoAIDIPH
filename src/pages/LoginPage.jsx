import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Grid, Card, CardContent } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await login({ email, password });
      
      if (response?.status === 201) {
        navigate('/');
      } else {
        alert(error?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      const errorMessage = error?.response?.data?.message;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '90vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'linear-gradient(to bottom, #000, #222)' }}>
    
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            maxWidth: 400,
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'background.paper',
            animation: 'slide-up 0.5s ease-in-out',
            margin: 'auto', // Center the card horizontally
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Box sx={{ backgroundColor: 'primary.main', color: 'white', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '0 auto' }}>
                A
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginTop: 2, color: 'text.primary' }}>
                AIDIPH
              </Typography>
            </Box>
            
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordToggle} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 3,
                  padding: '12px',
                  backgroundColor: '#7165EF',
                  fontWeight: 'bold',
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
