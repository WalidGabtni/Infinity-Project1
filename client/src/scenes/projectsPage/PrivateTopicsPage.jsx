import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import ProjectPrivateTopicWidget from 'scenes/widgets/ProjectPrivateTopicWidget';
import Box from '@mui/material/Box';
import { Typography, useTheme, Divider, Button, Grid } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';

import TopicPostForm from 'components/TopicPostForm';

const PrivateTopicsPage = () => {
  const { projectId } = useParams();
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?.id);
  const { palette } = useTheme();

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
          <ProjectPrivateTopicWidget project={project} userId={userId} />
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

export default PrivateTopicsPage;
