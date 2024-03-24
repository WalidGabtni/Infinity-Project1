import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const PublicTopicDetailsPage = () => {
  const { projectId, topicId } = useParams(); // Extract projectId and topicId from URL parameters
  const [topicDetails, setTopicDetails] = useState(null);
  const users = useSelector((state) => state.users); // Assuming you have a users slice in Redux

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
    <WidgetWrapper>
      {topicDetails && (
        <Box sx={{ mb: '1rem' }}>
          <Typography variant="h3" sx={{ color: 'primary.main' }}>{topicDetails.title}</Typography>
          <Typography variant="body1" sx={{ color: 'neutral.main' }}>{topicDetails.content}</Typography>
          {topicDetails.userId && users[topicDetails.userId] && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '0.5rem' }}>
              <UserImage image={users[topicDetails.userId].picturePath} size="30px" />
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                {users[topicDetails.userId].firstName} {users[topicDetails.userId].lastName}
              </Typography>
            </Box>
          )}
          <Divider variant="middle" />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PublicTopicDetailsPage;
