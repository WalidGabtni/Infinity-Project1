import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const RoleMenu = ({ onSelectRole }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  

  const handleRoleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRoleMenuItemClick = (role) => {
    onSelectRole(role); // Pass the selected role to the parent component
    setAnchorEl(null); // Close the menu after selecting a role
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRoleButtonClick} // Open the menu on button click
        sx={{ paddingRight: '10px' }}
      >
        Role
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)} // Close the menu on outside click
      >
        <MenuItem onClick={() => handleRoleMenuItemClick('moderator')}>Moderator</MenuItem>
        <MenuItem onClick={() => handleRoleMenuItemClick('user')}>User</MenuItem>
      </Menu>
    </>
  );
};

export default RoleMenu;
