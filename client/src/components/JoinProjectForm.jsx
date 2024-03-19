import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import Overlay from 'components/Overlay';
import { CloseOutlined } from '@mui/icons-material';

const JoinProjectForm = ({ projectId, loggedInUserId, onClose, onJoinProject }) => {
  const { palette } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      // Call the onJoinProject function passed as prop to send the join request
      await onJoinProject(projectId, loggedInUserId);
      onClose();
    } catch (error) {
      console.error('Failed to join project:', error);
      // Handle error or display error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Overlay>
        <Box
          width="80%"
          height="30vh" // Adjust height as needed
          backgroundColor={palette.background.paper}
          padding="1rem"
          borderRadius="8px"
          position="fixed"
          top="25%"
          left="10%"
          zIndex="999"
          overflow="auto"
        >
          <Typography variant="h6" gutterBottom>
            Join Project
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Joining...' : 'Join'}
          </Button>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: '1rem', right: '1rem', padding: 1 }}>
            <CloseOutlined />
          </IconButton>
        </Box>
      </Overlay>
    </>
  );
};

export default JoinProjectForm;
