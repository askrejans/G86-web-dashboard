// src/App.js
import React, { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import theme from './theme';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar onMenuToggle={toggleMenu} />
        <Menu open={isMenuOpen} onClose={toggleMenu} />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
