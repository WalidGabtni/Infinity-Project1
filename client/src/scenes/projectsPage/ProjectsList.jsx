// Inside ProjectsList component
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
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import WidgetWrapper from 'components/WidgetWrapper';
import ProjectImage from 'components/ProjectImage'; 

const ProjectsList = ({ projects, onDeleteProject, onUpdateProject, loggedInUserId, onJoinProject }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const theme = useTheme();

  const handleMenuOpen = (event, project) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleJoinProjectClick = (projectId) => {
    const project = projects.find((p) => p._id === projectId);

    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return;
    }

    const isUserProjectCreator = loggedInUserId === project.userId;
    const isUserAlreadyMember = project.members && project.members.some((member) => member.userId === loggedInUserId);

    if (!isUserProjectCreator && !isUserAlreadyMember) {
      onJoinProject(projectId, loggedInUserId /* Add other user information as needed */);
    }
  };

  return (
    <WidgetWrapper>
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
                  {/* ProjectImage component to display the project image */}
                  <ProjectImage image={project.projectImage} size="60px" />
                  <Link
                    to={`/projects/${project._id}`}
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.text.primary,
                      padding: '10px',
                      borderRadius: '5px',
                      display: 'inline-block',
                    }}
                  >
                    <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      Project Name: {project.name}
                    </Typography>
                  </Link>
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

                  {(!project.members || (loggedInUserId !== project.userId && !project.members.some((member) => member.userId === loggedInUserId))) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleJoinProjectClick(project._id)}
                      style={{ position: 'absolute', top: '1rem', right: '2rem' }}
                    >
                      Join Project
                    </Button>
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
    </WidgetWrapper>
  );
};

export default ProjectsList;
