import React from 'react';
import { Box } from '@mui/material';
import MenuAppBar from './MenuAppBar';
import { useAuth } from '../auth/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" overflow="hidden">
      
    
        <Box position="fixed" width="100%" zIndex={1100}>
          <MenuAppBar />
        </Box>
    
      
      <Box component="main" flexGrow={1} mt={8} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
