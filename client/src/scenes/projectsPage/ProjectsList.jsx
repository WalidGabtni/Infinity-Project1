import React, { useState, useEffect } from 'react';
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
  Alert,
  AlertTitle,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import WidgetWrapper from 'components/WidgetWrapper';
import ProjectImage from 'components/ProjectImage'; 
import ProjectCover from 'components/ProjectCover';
import AvatarGroup from '@mui/material/AvatarGroup';
import UserImage from 'components/UserImage';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import JoinProjectForm from 'components/JoinProjectForm'; 


const ProjectsList = ({ projects, onDeleteProject, onUpdateProject, loggedInUserId, onJoinProject }) => {
  console.log('Projects in ProjectsList:', projects);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const theme = useTheme();

   // State variables for managing the JoinProjectForm
   const [showJoinProjectForm, setShowJoinProjectForm] = useState(false);
   const [selectedProjectForJoin, setSelectedProjectForJoin] = useState(null);

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
      // Open the JoinProjectForm for the selected project
      setSelectedProjectForJoin(projectId);
      setShowJoinProjectForm(true);
    }
  };

  // Function to handle closing the JoinProjectForm
  const handleCloseJoinProjectForm = () => {
    setShowJoinProjectForm(false);
    setSelectedProjectForJoin(null);
  };

  // New state for the confirmation dialog
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedProjectForDeletion, setSelectedProjectForDeletion] = useState(null);
  // State for the success alert
  const [successAlert, setSuccessAlert] = useState(false);
  // New state to track whether a project has been deleted
  const [isProjectDeleted, setIsProjectDeleted] = useState(false);

  // Function to open the confirmation dialog
  const handleDeleteConfirmationOpen = (project) => {
    setDeleteConfirmationOpen(true);
    setSelectedProjectForDeletion(project);
  };

  // Function to close the confirmation dialog
  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
    setSelectedProjectForDeletion(null);
  };

  // Function to handle the actual project deletion
  const handleDeleteProject = () => {
    if (selectedProjectForDeletion) {
      onDeleteProject(selectedProjectForDeletion._id);
      handleDeleteConfirmationClose();

      // Store a flag in localStorage to indicate the need for an alert after reload
      localStorage.setItem('showSuccessAlertAfterReload', 'true');

      // Reload the page
      window.location.reload();
    }
  };

  // useEffect to handle the success alert after the page reloads
  useEffect(() => {
    // Check if the flag is set in localStorage
    const showSuccessAlertAfterReload = localStorage.getItem('showSuccessAlertAfterReload');

    if (showSuccessAlertAfterReload === 'true') {
      // Clear the flag in localStorage
      localStorage.removeItem('showSuccessAlertAfterReload');

      // Set success alert state to true after reloading the page
      setSuccessAlert(true);

      // Hide the success alert after a certain duration
      const alertTimeoutId = setTimeout(() => {
        setSuccessAlert(false);
      }, 5000); // Adjust the duration of the alert as needed

      // Clear the timeout on component unmount
      return () => clearTimeout(alertTimeoutId);
    }
  }, [setSuccessAlert]);

  // useEffect to hide the success alert after the page reloads
  useEffect(() => {
    // Hide the success alert after a certain duration even after the page reload
    const hideAlertTimeoutId = setTimeout(() => {
      setSuccessAlert(false);
    }, 5000); // Adjust the duration of the alert as needed

    // Clear the timeout on component unmount
    return () => clearTimeout(hideAlertTimeoutId);
  }, [setSuccessAlert]);

  return (
    <WidgetWrapper>
      <Grid container spacing={2}>
        {projects && projects.length > 0 ? (
          projects.map((project) => {
            console.log('Mapping project:', project);
            return (
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
                    {/* ProjectCover component with a unique key */}
                    <ProjectCover key={`cover_${project._id}`} image={project.projectCover} size="100px" />

                    <Box
                      position="absolute"
                      top="70px"
                      left="30px"
                    >
                      <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'white' }}>
                        {/* ProjectImage component with a unique key */}
                        <ProjectImage key={`image_${project._id}`} image={project.projectImage} size="80px" />
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

               {/* Render the JoinProjectForm */}
               {showJoinProjectForm && selectedProjectForJoin === project._id && (
                 <JoinProjectForm
                   projectId={project._id}
                   loggedInUserId={loggedInUserId}
                   projects={projects}
                   onClose={handleCloseJoinProjectForm}
                   onJoinProject={onJoinProject}
                 />
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
                <MenuItem onClick={() => { onUpdateProject(selectedProject._id); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { handleDeleteConfirmationOpen(selectedProject); handleMenuClose(); }}>Delete</MenuItem>
              </Menu>

            </Grid>
            );
          })
          
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              No projects available.
            </Typography>
          </Grid>
        )}
        {/* Confirmation dialog for project deletion */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteConfirmationClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete the project "{selectedProjectForDeletion?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
            <Button sx={{color:"red" }} onClick={handleDeleteProject} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success alert */}
        <Stack sx={{ width: '500px', position: 'fixed', bottom: 28, right: '72%' }}>
          {successAlert && (
            <Alert severity="error" onClose={() => setSuccessAlert(false)}>
              <AlertTitle>Delete</AlertTitle>
              Project deleted successfully.
            </Alert>
          )}
        </Stack>
      </Grid>
    </WidgetWrapper>
  );
};

export default ProjectsList;
