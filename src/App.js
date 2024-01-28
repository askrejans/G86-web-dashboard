import React, { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SmallDashboard from './components/SmallDashboard';
import Settings from './components/Settings';
import theme from './theme';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <Navbar onMenuToggle={toggleMenu} />
          <Menu open={isMenuOpen} onClose={toggleMenu} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/small-dashboard" element={<SmallDashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
