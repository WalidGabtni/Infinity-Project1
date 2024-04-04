import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import PublicTopicTitleWidget from 'scenes/widgets/PublicTopicTitleWidget';
import { useSelector } from 'react-redux';
import UserImage from 'components/UserImage';
import TopicPostForm from 'components/TopicPostForm';
import TopicDetailsWidget from 'scenes/widgets/TopicDetailsWidget';
import CustomPagination from 'components/ProjectPagination';
import NavigationBreadcrumbs from 'components/NavigationBreadcrumbs';
import CommentWidget from 'scenes/widgets/CommentWidget';
import GetCommentsWidget from 'scenes/widgets/GetCommentsWidget';
import TopicModerationActions from 'components/TopicModerationActions';

const PublicTopicDetailsPage = () => {
  const { projectId, topicId } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTopicLocked, setIsTopicLocked] = useState(false); // State to track the lock status of the topic
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const navigate = useNavigate();
  const projectOwnerId = project?.userId; // Fetch project owner's ID

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicDetails(data);
        setIsTopicLocked(data.locked === true); // Update isTopicLocked only if data.locked exists
        console.log('Topic Details:', data);
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicDetails();
  }, [projectId, topicId]);

  const handleNewTopicClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const createTopic = async (newTopicData) => {
    try {
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      // Check if the topic is locked, if yes, prevent topic creation
      if (isTopicLocked) {
        throw new Error('Topic is locked');
      }

      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newTopicData, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      const responseData = await response.json();
      console.log('New topic created:', responseData);

      handleFormClose();
    } catch (error) {
      console.error('Error creating topic:', error.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/projects/${projectId}/public-topics/${topicId}/page/${pageNumber}`);
  };

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
          <Grid container spacing={2} justifyContent="flex-end" >
              {/* Grid item for Moderation Actions button */}
           <Grid item >
              {/* Conditionally render TopicModerationActions only if the user is the project owner */}
              {userId === projectOwnerId && <TopicModerationActions projectId={projectId} topicId={topicId} token={token} />}
            </Grid>
            <Grid item>
              <Button onClick={handleNewTopicClick} variant="contained" color="primary" size="large">
                Start New Topic
              </Button>
            </Grid>
          </Grid>
          <Box m="1rem 0" />
          <CustomPagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          {isFormOpen && <TopicPostForm onClose={handleFormClose} onPost={createTopic} userId={userId}/>}
          <Box m="1rem 0" />
          <TopicDetailsWidget topicDetails={topicDetails} />
          <Box m="2rem 0" />
          <GetCommentsWidget projectId={projectId} topicId={topicId} isPrivate={false}/>
          <Box m="2rem 0" />
          {topicDetails && console.log('Topic locked status:', topicDetails.locked)}
          {userId === projectOwnerId || !topicDetails?.locked ? (
  <Box width="100%" p="1rem"> 
    <CommentWidget projectId={projectId} topicId={topicId} topicDetails={topicDetails} isPrivate={false}/>
  </Box>
) : (
  <Box width="100%" p="1rem"> 
    <Typography variant="body2" color="textSecondary">This topic is locked. Comments are disabled.</Typography>
  </Box>
)}

        </Box>
      </Box>
    </div>
  );
};

export default PublicTopicDetailsPage;
