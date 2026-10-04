import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams, Link } from 'react-router-dom';
import UserImage from 'components/UserImage'; // Import the UserImage component

const PublicTopicTitleWidget = ({ project, userId }) => {
  const { projectId, topicId } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [createdAt, setCreatedAt] = useState(null); // State variable to hold the creation date

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }

        const data = await response.json();
        setTopicDetails(data); // Update state with the fetched topic details
        setCreatedAt(data.createdAt); // Update state with the creation date
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicDetails();
  }, [projectId, topicId]);

  useEffect(() => {
    console.log('topicDetails:', topicDetails);
    console.log('createdAt:', createdAt); // Log the creation date
  }, [topicDetails, createdAt]);

  return (
    <WidgetWrapper>
      {topicDetails && (
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            {topicDetails.title}
          </Typography>
          <Divider variant="fullWidth" sx={{ mt: 2 }} />
          {/* Display user information */}
          {topicDetails.createdBy ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              {/* Display user image */}
              <Link to={`/profile/${topicDetails.createdBy.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <UserImage image={topicDetails.createdBy.picturePath} size="45px" />
              </Link>
              <Box sx={{ ml: 1 }}>
                {/* Redirect to user profile page when clicking on the user's name */}
                <Link to={`/profile/${topicDetails.createdBy.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {/* Display user name */}
                  <Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>{`${topicDetails.createdBy.firstName} ${topicDetails.createdBy.lastName}`}</Typography>
                </Link>
                {/* Display Created At information */}
                {topicDetails.createdAt && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {new Date(topicDetails.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} in{' '}
                    {/* Make sure projectId is correctly passed to the link */}
                    <Link
                      to={`/projects/${projectId}/public-topics`}
                      style={{
                        textDecoration: 'none', // Remove underline
                        color: 'inherit', // Inherit color from parent
                        '&:hover': {
                          textDecoration: 'none', // Remove underline on hover
                        },
                      }}
                    >
                      Public Topics
                    </Link>
                  </Typography>
                )}
              </Box>
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
