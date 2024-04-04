import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function TopicModerationActions({ projectId, topicId, token, isPublic }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTopicLocked, setIsTopicLocked] = useState(false);
  const [isTopicPinned, setIsTopicPinned] = useState(false);

  // Function to update the locked status of the topic
const updateLockedStatus = async () => {
  try {
    const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch topic details');
    }
  
    const data = await response.json();
    setIsTopicLocked(data.locked === true); // Update isTopicLocked only if data.locked exists
  } catch (error) {
    console.error('Error updating locked status:', error);
  }
};

// Call updateLockedStatus on component mount to fetch the latest locked status
useEffect(() => {
  updateLockedStatus();
}, []);

// Function to update the pinned status of the topic
const updatePinnedStatus = async () => {
  try {
    const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch topic details');
    }
  
    const data = await response.json();
    setIsTopicPinned(data.pinned === true); // Update isTopicPinned only if data.pinned exists
  } catch (error) {
    console.error('Error updating pinned status:', error);
  }
};

// Call updatePinnedStatus on component mount to fetch the latest pinned status
useEffect(() => {
  updatePinnedStatus();
}, []);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleLockTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}/${isTopicLocked ? 'unlock' : 'lock'}`, {
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
      setIsTopicLocked(!isTopicLocked);
    } catch (error) {
      console.error(`Error ${isTopicLocked ? 'unlocking' : 'locking'} topic:`, error);
    }
  };

  const togglePinTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}/pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Error: Toggle pin request failed with status:`, response.status);
        throw new Error(`Failed to toggle pin status of topic`);
      }

      const data = await response.json();
      console.log(` ${data.message}`);

      setIsTopicPinned(prev => !prev);
    } catch (error) {
      console.error(`Error toggling pin status of topic:`, error);
    }
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
        <MenuItem onClick={togglePinTopic}>{isTopicPinned ? 'Unpin' : 'Pin'} Topic</MenuItem>
        <MenuItem onClick={hideTopic}>Hide Topic</MenuItem>
        <MenuItem onClick={moveTopic}>Move Topic</MenuItem>
      </Menu>
    </div>
  );
}

export default TopicModerationActions;
