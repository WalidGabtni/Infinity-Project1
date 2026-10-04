import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import ProjectArchiveWidget from 'scenes/widgets/ProjectArchiveWidget';
import Box from '@mui/material/Box';
import { Button, Grid } from '@mui/material'; // Import Button component from MUI

import TopicPostForm from 'components/TopicPostForm';

const ArchivePage = () => {
  const { projectId } = useParams();
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?.id);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility

  const handleNewTopicClick = () => {
    setIsFormOpen(true); // Open the form when the "New Topic" button is clicked
  };

  const handleFormClose = () => {
    setIsFormOpen(false); // Close the form
  };

  return (
    <div>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis="100%">
          <ProjectProfileWidget project={project} userId={userId} /> 
          <Box m="2rem 0" />
          <ProjectArchiveWidget />
          <Box m="1rem 0" />
          {/* Button to start a new topic */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={handleNewTopicClick} variant="contained" color="primary" size="large">
                Start New Topic
              </Button>
            </Grid>
          </Grid>
          {isFormOpen && <TopicPostForm onClose={handleFormClose} />}
        </Box>
      </Box>
    </div>
  );
};

export default ArchivePage;
