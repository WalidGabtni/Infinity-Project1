import React, { useState } from 'react';
import {
  Card,
  Box,
  CardContent,
  Typography,
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ProjectsList = ({ projects, onDeleteProject, onUpdateProject, loggedInUserId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  return (
    <Grid container spacing={2}>
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <Grid item key={project._id} xs={12} sm={6} md={6} lg={6}>
            <Card
              sx={{
                maxWidth: 800,
                margin: '0 auto',
                border: '1px solid black',
                position: 'relative',
              }}
            >
              <CardContent>
              <Typography variant="h5" component="div">
                Project Name: {project.name}
              </Typography>
              <Box m="0.2rem 0" />
              <Divider />
              <Box m="1rem 0" />
              <Typography variant="body2" color="text.secondary">
                Project Description: {project.description}
              </Typography>
              <Box m="3rem 0" />
              <Typography variant="body2" color="text.secondary">
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                End Date: {new Date(project.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Status: {project.currentStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(project.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updated At: {new Date(project.updatedAt).toLocaleString()}
              </Typography>

                {loggedInUserId === project.userId && (
                  <div>
                    <IconButton
                      style={{ position: 'absolute', top: '0.5rem', right: '2rem' }}
                      onClick={(event) => handleMenuOpen(event, project)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                )}
              </CardContent>
            </Card>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => onUpdateProject(selectedProject._id)}>Edit</MenuItem>
              <MenuItem onClick={() => onDeleteProject(selectedProject._id)}>Delete</MenuItem>
            </Menu>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            No projects available.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ProjectsList;
