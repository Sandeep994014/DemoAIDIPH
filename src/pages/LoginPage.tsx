import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Grid, Card, CardContent } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../services/auth';
import {  useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
  
    try {
      console.log("email and password", email, password);
  
      const response = await login({ email, password });
  
      console.log("response:", response);
  
      if (response?.status === 201) {
        console.log("Login successful, navigating to home...");
        navigate('/');
      } else {
        console.log("Unexpected response status:", response?.status);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage = error?.response?.data?.message || 'Something went wrong, please try again later.';
      alert(errorMessage);
    }
  };
  
  

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box
          sx={{
            height: '100%',
            background: 'url(https://engineersahabedu.com/wp-content/uploads/2024/03/The-Role-of-AI-in-UIUX-Design-scaled.jpg) no-repeat center center',
            backgroundSize: 'cover',
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAEBEF' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            padding: 4,
            backgroundColor: 'lightwhite',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <Box sx={{ backgroundColor: 'black', color: 'white', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '24px' }}>
                A
              </Box>
            </Box>

            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 2, color: 'dark' }}>
              AIDIPH
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
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

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '12px', marginTop: 3, backgroundColor: '#7165EF', fontSize: '16px', fontWeight: 'bold' }}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
