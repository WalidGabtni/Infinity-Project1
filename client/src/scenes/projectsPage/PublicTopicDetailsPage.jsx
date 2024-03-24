import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import PublicTopicTitleWidget from 'scenes/widgets/PublicTopicTitleWidget';
import { useSelector } from 'react-redux';

const PublicTopicDetailsPage = () => {
  const { projectId, topicId } = useParams(); // Extract projectId and topicId from URL parameters
  const [topicDetails, setTopicDetails] = useState(null);
  const users = useSelector((state) => state.users); // Assuming you have a users slice in Redux
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?._id);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicDetails(data); // Update state with fetched topic details
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicDetails();
  }, [projectId, topicId]);

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
          <PublicTopicTitleWidget project={project} userId={userId}/>
          <Box m="2rem 0" />
          <WidgetWrapper>
            {topicDetails && (
              <Box sx={{ mb: '1rem' }}>
              
                <Typography variant="body1" sx={{ color: 'neutral.main' }} dangerouslySetInnerHTML={{ __html: topicDetails.content }} />
              </Box>
            )}
          </WidgetWrapper>
        </Box>
      </Box>
    </div>
  );
};

export default PublicTopicDetailsPage;
