// src/components/Menu.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Menu = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem button key="dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button key="settings">
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;
