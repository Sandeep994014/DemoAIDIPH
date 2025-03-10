import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
// ...existing imports...

function App() {
  return (
    <SidebarProvider>
      <Router>
        {/* ...existing components... */}
      </Router>
    </SidebarProvider>
  );
}

export default App;
