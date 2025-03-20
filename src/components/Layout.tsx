import React from 'react';
import { Box } from '@mui/material';
import MenuAppBar from './MenuAppBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box position="fixed" width="100%">
        <MenuAppBar />
      </Box>
      <Box component="main" flexGrow={1} mt={8}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
