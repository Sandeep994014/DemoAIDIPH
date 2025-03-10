// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Grid, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    // Handle login logic here
    console.log('Logging in with', { email, password });
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side Image */}
      <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box
          sx={{
            height: '100%',
            background: 'url(https://engineersahabedu.com/wp-content/uploads/2024/03/The-Role-of-AI-in-UIUX-Design-scaled.jpg) no-repeat center center',
            backgroundSize: 'cover',
          }}
        />
      </Grid>

      {/* Right Side Form */}
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
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <Box sx={{ backgroundColor: 'black', color: 'white', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '24px' }}>
                A
              </Box>
            </Box>

            {/* Brand Name */}
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 2, color: 'dark' }}>
              AIDIPH
            </Typography>

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* Email Input */}
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
                      <img src="https://img.icons8.com/ios/452/email.png" width="20" alt="email" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Input */}
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
                      <img src="https://img.icons8.com/ios/452/lock.png" width="20" alt="lock" />
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

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right', marginTop: 1 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '12px', marginTop: 3, backgroundColor: '#7165EF', fontSize: '16px' , fontWeight: 'bold' }}>
                Login
              </Button>

              {/* Or Divider */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  or
                </Typography>
              </Box>

              {/* Login with Email Link Button */}
              <Button variant="outlined" fullWidth sx={{ marginTop: 2, borderColor: '#7165EF', color: '#7165EF' , fontWeight: 'bold' }}>
                Login with Email Link
              </Button>
            </form>

            {/* Navigation */}
            <Box sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)' }}>
              <Button variant="outlined" color="secondary" href="/" sx={{ textTransform: 'none', borderColor: '#7165EF', color: '#7165EF' }}>
                Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
