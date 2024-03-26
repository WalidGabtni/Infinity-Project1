import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import ProjectPublicTopicWidget from 'scenes/widgets/ProjectPublicTopicWidget';
import PublicTopicsClickWidget from 'scenes/widgets/PublicTopicsClickWidget';
import Box from '@mui/material/Box';
import { Typography, useTheme, Divider, Button, Grid } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import NavigationBreadcrumbsPublicTopics from 'components/NavBreadcrumbsPublicTopicsPage';
import TopicPostForm from 'components/TopicPostForm';


const PublicTopicsPage = () => {
  const { projectId } = useParams();
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?._id);
  const { palette } = useTheme();

  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility

  const handleNewTopicClick = () => {
    setIsFormOpen(true); // Open the form when the "Start New Topic" button is clicked
  };

  const handleFormClose = () => {
    setIsFormOpen(false); // Close the form
  };

  const createTopic = async (newTopicData) => {
    try {
      // Get the logged-in user ID
      

      // Check if the user is authenticated
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newTopicData, userId }), // Include the userId in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      // Optionally, you can handle the response data here
      const responseData = await response.json();
      console.log('New topic created:', responseData);

      // Close the form after successfully creating the topic
      handleFormClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating topic:', error.message);
      // Handle error state or display error message to the user
    }
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
        <NavigationBreadcrumbsPublicTopics projectId={projectId} projectName={project.name}/>
        <Box m="2rem 0" />
          <ProjectProfileWidget project={project} userId={userId} />
          <Box m="2rem 0" />
          <ProjectPublicTopicWidget projectId={project._id} userId={userId} />
          <Box m="1rem 0" />
          {/* Button to start a new topic */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={handleNewTopicClick} variant="contained" color="primary" size="large">
                Start New Topic
              </Button>
            </Grid>
          </Grid>
          <Box m="1rem 0" />
          <PublicTopicsClickWidget projectId={project._id}/>
          {/* Render the TopicPostForm component if isFormOpen is true */}
          {isFormOpen && <TopicPostForm onClose={handleFormClose} onPost={createTopic} userId={userId}/>}
          <Box m="2rem 0" />
          <NavigationBreadcrumbsPublicTopics projectId={projectId} projectName={project.name}/>
        </Box>
      </Box>
    </div>
  );
};

export default PublicTopicsPage;
