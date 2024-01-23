import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Navbar = ({ onMenuToggle }) => {
  const [appBarVisible, setAppBarVisible] = useState(true);

  const toggleAppBarVisibility = () => {
    setAppBarVisible(!appBarVisible);
  };

  return (
    <>
      <Button
        color="inherit"
        style={{
          position: 'fixed',
          top: '8px',
          right: '8px',
          zIndex: 1000,
        }}
        onClick={toggleAppBarVisibility}
      >
        {appBarVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </Button>
      {appBarVisible && (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onMenuToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Navbar;
