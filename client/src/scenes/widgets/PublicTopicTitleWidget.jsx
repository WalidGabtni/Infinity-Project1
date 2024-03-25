import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams } from 'react-router-dom';
import UserImage from 'components/UserImage'; // Import the UserImage component

const PublicTopicTitleWidget = ({ project, userId }) => { // Accept project and userId props
  const { projectId, topicId } = useParams(); // Extract projectId and topicId from URL parameters
  const [topicDetails, setTopicDetails] = useState(null);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicDetails(data); // Update state with the fetched topic details
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicDetails();
  }, [projectId, topicId]);

  useEffect(() => {
    console.log('topicDetails:', topicDetails);
  }, [topicDetails]);

  return (
    <WidgetWrapper>
      {topicDetails && (
        <Box>
          <Typography variant="h3" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            {topicDetails.title}
          </Typography>
          <Divider variant="fullWidth" sx={{ mt: 1 }} />
          {topicDetails.createdBy ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {/* Use the UserImage component to display the user's image */}
              <UserImage image={topicDetails.createdBy.picturePath} size="40px" />
              <Typography variant="body1" sx={{ ml: 1 }}>{`${topicDetails.createdBy.firstName} ${topicDetails.createdBy.lastName}`}</Typography>
            </Box>
          ) : (
            <Typography variant="body1">User details not available</Typography>
          )}
          
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PublicTopicTitleWidget;
