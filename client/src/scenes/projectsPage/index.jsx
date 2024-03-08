import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import NewProjectForm from './NewProjectForm';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import ProjectsList from './ProjectsList';
import { setProjects } from 'state';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null); // Add state for editProjectId
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/projects', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(setProjects({ projects: data }));
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };

    fetchProjects();
  }, [token, dispatch]);

  const handleToggleForm = (projectId = null) => {
    setShowForm(!showForm);
    setEditProjectId(projectId); // Set the editProjectId based on the provided projectId
  };

  const handleDeleteProject = async (projectId) => {
    try {
      if (!projectId) {
        console.error('Project ID is undefined');
        return;
      }

      const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Project deleted successfully');
        // You may want to refresh the projects list or update the state accordingly.
      } else {
        console.error('Failed to delete project:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box
        position="relative"
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis="26%">
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          sx={{
            marginRight: 10
          }}
          flexBasis={isNonMobileScreens ? '70%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          {showForm && (
            <NewProjectForm token={token} onClose={() => handleToggleForm()} editProjectId={editProjectId} />
          )}

          <ProjectsList
            projects={projects}
            loggedInUserId={_id}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleToggleForm} // Pass the handleToggleForm function to update projects
          />

        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleToggleForm()} // Create new project
          sx={{
            position: 'absolute',
            top: 35,
            right: 25,
            zIndex: 1000,
          }}
        >
          Create Project
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectsPage;


