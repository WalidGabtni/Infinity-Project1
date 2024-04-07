import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal'; // Import Modal from Material-UI
import { FormControl, InputLabel, Select } from '@mui/material'; // Import form components



function TopicModerationActions({ projectId, topicId, token, isPublic }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTopicLocked, setIsTopicLocked] = useState(false);
  const [isTopicPinned, setIsTopicPinned] = useState(false);
  const [isTopicHidden, setIsTopicHidden] = useState(false);
  const [destination, setDestination] = useState(''); // State to store the selected destination
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeDestination = (event) => {
    setDestination(event.target.value);
    console.log('Selected destination:', event.target.value);
  };

  const handleMoveTopic = async () => {
    try {
      if (!destination) {
        console.error('Destination is required');
        return;
      }

      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ destination })
      });

      if (!response.ok) {
        console.error('Move topic request failed:', response.status);
        throw new Error('Failed to move topic');
      }

      console.log('Topic moved successfully');

      // Redirect to the appropriate section based on the destination
      window.location.href = `/projects/${projectId}/${destination === 'private' ? 'private' : 'public'}-topics`;

    } catch (error) {
      console.error('Error moving topic:', error);
    }
  };
  

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
      setIsTopicLocked(data.locked === true);
    } catch (error) {
      console.error('Error updating locked status:', error);
    }
  };

  useEffect(() => {
    updateLockedStatus();
  }, []);

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
      setIsTopicPinned(data.pinned === true);
    } catch (error) {
      console.error('Error updating pinned status:', error);
    }
  };

  useEffect(() => {
    updatePinnedStatus();
  }, []);

  const updateHiddenStatus = async () => {
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
      setIsTopicHidden(data.hidden === true);
    } catch (error) {
      console.error('Error updating hidden status:', error);
    }
  };

  useEffect(() => {
    updateHiddenStatus();
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

      setIsTopicPinned(!isTopicPinned);
    } catch (error) {
      console.error(`Error toggling pin status of topic:`, error);
    }
  };

  const toggleHideTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPublic ? 'public' : 'private'}/${topicId}/hide`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Error: Toggle hide request failed with status:`, response.status);
        throw new Error(`Failed to toggle hide status of topic`);
      }

      setIsTopicHidden(!isTopicHidden);
    } catch (error) {
      console.error(`Error toggling hide status of topic:`, error);
    }
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
        <MenuItem onClick={toggleHideTopic}>{isTopicHidden ? 'Unhide' : 'Hide'} Topic</MenuItem>
        <MenuItem onClick={handleOpenModal}>Move Topic</MenuItem>
      </Menu>

      {/* Modal for selecting destination */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{
          position: 'absolute',
          width: 400,
          border: '2px solid #000',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Use the desired box shadow
          padding: '16px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <FormControl fullWidth>
            <InputLabel>Select Destination</InputLabel>
            <Select
              value={destination}
              onChange={handleChangeDestination}
            >
              {/* Populate dropdown with destination options */}
              <MenuItem value="private">Private Topic</MenuItem>
              <MenuItem value="public">Public Topic</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
          <Button onClick={handleMoveTopic}>Move</Button>
        </div>
      </Modal>

    </div>
  );
}

export default TopicModerationActions;
