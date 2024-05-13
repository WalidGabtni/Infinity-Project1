import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import PublicTopicTitleWidget from 'scenes/widgets/PublicTopicTitleWidget';
import TopicModerationActions from 'components/TopicModerationActions';
import CustomPagination from 'components/ProjectPagination';
import NavigationBreadcrumbs from 'components/NavigationBreadcrumbs';
import CommentWidget from 'scenes/widgets/CommentWidget';
import GetCommentsWidget from 'scenes/widgets/GetCommentsWidget';
import TopicPostForm from 'components/TopicPostForm';
import TopicDetailsWidget from 'scenes/widgets/TopicDetailsWidget';

const PublicTopicDetailsPage = () => {
  const { projectId, topicId } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((proj) => proj._id === projectId);
  const navigate = useNavigate();
  const projectOwnerId = project?.userId;
  const projectAdminId = project?.userId;
  const projectModeratorId = project?.userId;
  const user = useSelector((state) => state.user);
  const { members } = project;

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicDetails(data);
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

  const isMember = members.some((member) => member.userId === user._id);
  const isAdmin = members.find((member) => member.userId === user._id && member.role === 'Admin');
  const isModerator = members.find((member) => member.userId === user._id && member.role === 'Moderator');
  const isOwner = user._id === projectOwnerId;


  return (
    <div>
      <Navbar />
      <Box width="100%" padding="2rem 6%" display="flex" gap="0.5rem" justifyContent="space-between">
        <Box flexBasis="100%">
          <NavigationBreadcrumbs projectId={projectId} projectName={project?.name} topicName={topicDetails?.title} topicId={topicId} />
          <Box m="2rem 0" />
          <ProjectProfileWidget project={project} userId={userId} />
          <Box m="2rem 0" />
          <PublicTopicTitleWidget project={project} userId={userId} />
          <Box m="1rem 0" />
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              {/* Render TopicModerationActions if user role is not "Member" */}
              {(isAdmin || isOwner || isModerator) && (
                  <TopicModerationActions projectId={projectId} topicId={topicId} token={token} isPublic={true} />
                )}
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
          {isFormOpen && <TopicPostForm onClose={handleFormClose} onPost={createTopic} userId={userId} />}
          <Box m="1rem 0" />
          <TopicDetailsWidget topicDetails={topicDetails} />
          <Box m="2rem 0" />
          <GetCommentsWidget projectId={projectId} topicId={topicId} isPrivate={false} />
          <Box m="2rem 0" />
          {topicDetails && (
            <Box width="100%" p="1rem">
              {topicDetails.locked ? (
                <Typography variant="body2" color="textSecondary">This topic is locked. Comments are disabled.</Typography>
              ) : (
                <CommentWidget projectId={projectId} topicId={topicId} topicDetails={topicDetails} isPrivate={false} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default PublicTopicDetailsPage;
