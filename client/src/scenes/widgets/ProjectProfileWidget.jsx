import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProjectImage from 'components/ProjectImage';
import ProjectCover from 'components/ProjectCover';
import WidgetWrapper from 'components/WidgetWrapper';
import { leaveProject } from 'state';

const ProjectProfileWidget = ({ project }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const projectOwnerId = project?.userId;

  const handleLeaveProject = async () => {
    try {
      const { _id: projectId } = project;
      const userId = user._id;
      const response = await fetch(`http://localhost:3001/projects/${projectId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to leave the project');
      }

      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error leaving the project:', error);
      // Handle error
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!project) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Project Not Found
        </Typography>
      </Box>
    );
  }

  const { _id: projectId, projectImage, projectCover, name, members } = project;

  const isMember = members.some((member) => member.userId === user._id);
  const isAdmin = members.find((member) => member.userId === user._id && member.role === 'Admin');
  const isModerator = members.find((member) => member.userId === user._id && member.role === 'Moderator');
  const isOwner = user._id === projectOwnerId;

  return (
    <WidgetWrapper>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <ProjectCover image={projectCover} size="150px" width="100%" />
        <Box position="absolute" top="40px" left="40px">
          <ProjectImage image={projectImage} size="80px" />
        </Box>
        <Box position="absolute" top="60px" left="140px" style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
          <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: 'white' }}>
            {name}
          </Typography>
        </Box>

        <Box m="1rem 0" />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Button variant="text" size="medium" component={Link} to={`/projects/${projectId}`}>
              Overview
            </Button>
            <Button variant="text" size="medium" component={Link} to={`/projects/${projectId}/members`}>
              Members
            </Button>
            <Button variant="text" size="medium" component={Link} to={`/projects/${projectId}/public-topics`}>
              Public Topics
            </Button>
            <Button variant="text" size="medium" component={Link} to={`/projects/${projectId}/private-topics`}>
              Private Topics
            </Button>
            <Button variant="text" size="medium" component={Link} to={`/projects/${projectId}/archive`}>
              Archive
            </Button>
          </div>

          {isMember && (isMember) && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              {(isAdmin || isOwner) && ( // Show button if user is admin or owner
                <Button
                  variant="text"
                  size="medium"
                  component={Link}
                  to={`/projects/${projectId}/members-management`}
                  style={{ marginRight: '10px' }}
                >
                  Members Management
                </Button>
              )}
              
              <Button variant="contained" color="error" size="medium" onClick={() => setOpenDialog(true)}>
                Leave Project
              </Button>
            </div>
          )}
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Leave Project</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to leave this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleLeaveProject} color="error" variant="contained">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default ProjectProfileWidget;
