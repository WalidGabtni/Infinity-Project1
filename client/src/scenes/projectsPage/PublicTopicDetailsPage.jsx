import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Link } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import PublicTopicTitleWidget from 'scenes/widgets/PublicTopicTitleWidget';
import { useSelector } from 'react-redux';
import UserImage from 'components/UserImage';
import TopicPostForm from 'components/TopicPostForm';
import TopicDetailsWidget from 'scenes/widgets/TopicDetailsWidget';
import CustomPagination from 'components/ProjectPagination';
import NavigationBreadcrumbs from 'components/NavigationBreadcrumbs'; // Import NavigationBreadcrumbs component

const PublicTopicDetailsPage = () => {
  const { projectId, topicId } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicDetails(data);
        console.log('Topic Details:', data); // Add this line to log topicDetails
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicDetails();
  }, [projectId, topicId]);

  const handleNewTopicClick = () => {
    setIsFormOpen(true); // Open the form when the button is clicked
  };

  const handleFormClose = () => {
    setIsFormOpen(false); // Close the form
  };

  const createTopic = async (newTopicData) => {
    try {
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
      // Refresh the page or update the topic list
      // For example, you can fetch the updated list of topics
    } catch (error) {
      console.error('Error creating topic:', error.message);
      // Handle error state or display error message to the user
    }
  };

  // Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/projects/${projectId}/public-topics/${topicId}/page/${pageNumber}`);
  };

  // Calculate total number of pages
  const totalItems = topicDetails ? topicDetails.totalTopics : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        <NavigationBreadcrumbs projectId={projectId} projectName={project.name} topicName={topicDetails?.title} topicId={topicId} />
        <Box m="2rem 0" />
          <ProjectProfileWidget project={project} userId={userId} />
          <Box m="2rem 0" />
          <PublicTopicTitleWidget project={project} userId={userId}/>
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
           {/* Render Pagination component */}
           <CustomPagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
              />
                      {/* Render the TopicPostForm component if isFormOpen is true */}
          {isFormOpen && <TopicPostForm onClose={handleFormClose} onPost={createTopic} userId={userId}/>}
          <Box m="1rem 0" />
          <TopicDetailsWidget topicDetails={topicDetails} />
          <Box m="2rem 0" />
          <NavigationBreadcrumbs projectId={projectId} projectName={project.name} topicName={topicDetails?.title} topicId={topicId} />
        </Box>
      </Box>
    </div>
  );
};

export default PublicTopicDetailsPage;
