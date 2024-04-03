import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function TopicModerationActions() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="topic-moderation-actions-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        size="large"
      >
        Moderation Actions
      </Button>
      <Menu
        id="topic-moderation-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Pin</MenuItem>
        <MenuItem onClick={handleClose}>Hide</MenuItem>
        <MenuItem onClick={handleClose}>Lock</MenuItem>
        <MenuItem onClick={handleClose}>Move</MenuItem>
      </Menu>
    </div>
  );
}

export default TopicModerationActions;
