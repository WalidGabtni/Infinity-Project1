import React, { useState, useEffect } from 'react';
import { Button, Typography, Box ,useMediaQuery} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import NewProjectForm from './NewProjectForm';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import ProjectsList from './ProjectsList';
import { setProjects } from 'state';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
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

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <Box>
    <Navbar />
    <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
      <Box flexBasis="26%">
        <UserWidget userId={_id} picturePath={picturePath} />
      </Box>
      <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
           <Button variant="contained" color="primary" onClick={handleToggleForm}>
          Create Project
        </Button>

        {showForm && (
          <NewProjectForm token={token} onClose={() => setShowForm(false)} />
        )}

        <ProjectsList projects={projects} />
        </Box>
    </Box>
  </Box>
  );
};

export default ProjectsPage;