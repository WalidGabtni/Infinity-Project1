// ProjectsPage.js
import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from 'scenes/navbar';
<<<<<<< Updated upstream
=======
import UserWidget from 'scenes/widgets/UserWidget';
import NewProjectForm from './NewProjectForm';
>>>>>>> Stashed changes
import ProjectsList from './ProjectsList';
import { setProjects } from 'state';
import IndividualProjectPage from './IndividualProjectPage';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
<<<<<<< Updated upstream
=======
  const [editProjectId, setEditProjectId] = useState(null);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);
>>>>>>> Stashed changes
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
<<<<<<< Updated upstream
=======
    setEditProjectId(projectId);
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
      } else {
        console.error('Failed to delete project:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
>>>>>>> Stashed changes
  };

  const handleJoinProject = async (projectId, userId, firstName, lastName) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          firstName,
          lastName,
        }),
      });
  
      if (response.ok) {
        console.log(`User ${userId} joined project ${projectId}`);
      } else {
        console.error('Failed to join project:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Button variant="contained" color="primary" onClick={handleToggleForm}>
        Create Project
      </Button>

      {showForm && (
        <NewProjectForm
          token={token}
          onClose={() => setShowForm(false)}
        />
      )}

<<<<<<< Updated upstream
      <ProjectsList projects={projects} />
    </div>
=======
          <Routes>
            <Route
              path="/"
              element={<ProjectsList
                projects={projects}
                loggedInUserId={_id}
                onDeleteProject={handleDeleteProject}
                onUpdateProject={(projectId) => handleToggleForm(projectId)}
                onJoinProject={handleJoinProject} // Pass the function here
              />}
            />
            <Route path="/:projectId" element={<IndividualProjectPage />} />
          </Routes>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleToggleForm()}
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
>>>>>>> Stashed changes
  );
};

export default ProjectsPage;
