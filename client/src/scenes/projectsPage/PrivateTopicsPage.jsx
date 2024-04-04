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
import PrivateTopicsClickWidget from 'scenes/widgets/PrivateTopicsClickWidget'


const PrivateTopicsPage = () => {
  const { projectId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?._id);
  const projectOwnerId = project?.userId; // Fetch project owner's ID
  const { palette } = useTheme();

  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility

  const handleCreatePrivateTopic = async (formData) => {
    try {
        // Check if the user is authenticated
        if (!userId) {
            throw new Error('User is not authenticated');
        }

        // Extract title and content from formData
        const { title, content } = formData;

        // Log relevant information for debugging
        console.log('Creating a new private topic...');
        console.log('Project ID:', projectId);
        console.log('User ID:', userId);
        console.log('Logged-in User ID:', loggedInUser);
        console.log('Title:', title);
        console.log('Content:', content);

        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/private`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content, userId }), // Include title, content, and userId in the request body
        });

        if (!response.ok) {
            throw new Error('Failed to create private topic');
        }

        // Optionally, you can handle the response data here
        const responseData = await response.json();
        console.log('New private topic created:', responseData);

        // Close the form after successfully creating the topic
        handleFormClose();
        console.log('Form closed.');

        // Reload the page to reflect the changes
        console.log('Reloading page...');
        window.location.reload();
    } catch (error) {
        console.error('Error creating private topic:', error.message);
        // Handle error state or display error message to the user
    }
};

  
  

  const handleNewTopicClick = () => {
    setIsFormOpen(!isFormOpen); // Toggle the form visibility
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
          <Grid container spacing={2} justifyContent="flex-end">
            {/* Conditionally render the button only for members */}
            {loggedInUser && project && project.members.some(member => member.userId === loggedInUser._id) && (
              <Grid item>
                <Button onClick={isFormOpen ? handleFormClose : handleNewTopicClick} variant="contained" color="primary" size="large">
                  {isFormOpen ? 'Cancel' : 'Start New Topic'}
                </Button>
              </Grid>
            )}
          </Grid>
          <Box m="1rem 0" />
          <PrivateTopicsClickWidget projectId={project._id} userId={userId}/>
          {isFormOpen && <TopicPostForm onClose={handleFormClose} onPost={handleCreatePrivateTopic} userId={userId}/>}
        </Box>
      </Box>
    </div>
  );
  
};

export default PrivateTopicsPage;
