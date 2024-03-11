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
import ProjectCover from 'components/ProjectCover';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import UserImage from 'components/UserImage';

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
                  height: '100%',
                }}
              >
                <CardContent>
                  {/* ProjectImage component to display the project image */}
                  <ProjectCover image={project.projectCover} size="100px" />

                  <Box
                    position="absolute"
                    top="70px"
                    left="30px"
                  >
                    <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'white' }}>
                    <ProjectImage image={project.projectImage} size="80px" />
                    </Link>
                  </Box>

                  <Box
                    position="absolute"
                    top="75px"
                    left="130px"
                    style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}
                  >
                    
                    <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <Typography variant="h5" component="div" style={{ fontWeight: 'bold'}}>
                        {project.name}
                      </Typography>
                      
                    </Link>
                  </Box>
                  
                  <Box m="3.5rem 0"/>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{
                      marginLeft: '20px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3, // Adjust the number of lines as needed
                      width: '460px', // Adjust the width to your desired maximum character limit
                    }}
                  >
                    {project.description.trim().length > 200 ? (
                      <>
                        {`${project.description.trim().slice(0, 200)}... `}
                        <Link to={`/projects/${project._id}`} style={{ textDecoration: 'underline', color: 'white', cursor: 'pointer' }}>
                          Click to check rest
                        </Link>
                      </>
                    ) : (
                      project.description.trim()
                    )}
                  </Typography>



                  <Box m="1rem 0" />
                  <Divider/>
                  <Box m="1rem 0" />

                
                    {/* Display avatars of project members using AvatarGroup */}
                    <AvatarGroup max={12} sx={{ display: 'flex', gap: '8px', flexDirection: 'row' }}>
                      {project.members && project.members.map((member) => (
                        <Link to={`/profile/${member.userId}`} key={member.userId} style={{ textDecoration: 'none', color: 'white' }}>
                          <UserImage image={member.picturePath} size="40px" userId={member.userId} />
                        </Link>
                      ))}
                    </AvatarGroup>    

                    <Box m="1rem 0" />
                    
                    <Divider/>


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
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinProjectClick(project._id)}
                      style={{ top: '1rem', width: '100%'}}
                    >
                      Join Project
                    </Button>
                  )}
                  <Box m="1rem 0" />
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
