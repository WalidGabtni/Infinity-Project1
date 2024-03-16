import React from 'react';
import { Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import Overlay from 'components/Overlay';
import { CloseOutlined } from '@mui/icons-material';

const JoinProjectForm = ({ projectId, loggedInUserId, onClose, onJoinProject }) => {
  const { palette } = useTheme();

  const handleJoin = () => {
    // Perform any validation or additional processing if needed
    onJoinProject(projectId, loggedInUserId);
    onClose();
    window.location.reload()

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
            sx={{ mt: 2 }}
          >
            Join
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
