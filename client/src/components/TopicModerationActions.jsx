import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function TopicModerationActions({ projectId, topicId, token }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTopicLocked, setIsTopicLocked] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleLockTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}/${isTopicLocked ? 'unlock' : 'lock'}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Error: ${isTopicLocked ? 'Unlock' : 'Lock'} request failed with status:`, response.status);
        throw new Error(`Failed to ${isTopicLocked ? 'unlock' : 'lock'} topic`);
      }

      console.log(`Topic ${isTopicLocked ? 'unlocked' : 'locked'} successfully`);
      setIsTopicLocked(!isTopicLocked); // Toggle the lock state
      // Add any additional logic here after locking or unlocking the topic, such as updating UI state
    } catch (error) {
      console.error(`Error ${isTopicLocked ? 'unlocking' : 'locking'} topic:`, error);
      // Handle error, e.g., display error message to the user
    }
  };

  // Add other moderation actions here
  const pinTopic = async () => {
    // Implement pin topic logic
  };

  const hideTopic = async () => {
    // Implement hide topic logic
  };

  const moveTopic = async () => {
    // Implement move topic logic
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
        <MenuItem onClick={toggleLockTopic}>{isTopicLocked ? 'Unlock' : 'Lock'} Topic</MenuItem>
        <MenuItem onClick={pinTopic}>Pin Topic</MenuItem>
        <MenuItem onClick={hideTopic}>Hide Topic</MenuItem>
        <MenuItem onClick={moveTopic}>Move Topic</MenuItem>
      </Menu>
    </div>
  );
}

export default TopicModerationActions;
