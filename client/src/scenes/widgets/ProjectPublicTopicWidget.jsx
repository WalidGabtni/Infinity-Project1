import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import UserImage from 'components/UserImage'; // Import the UserImage component

const ProjectPublicTopicWidget = ({ projectId }) => {
  const { palette } = useTheme();
  const [publicTopics, setPublicTopics] = useState([]);
  const users = useSelector((state) => state.users); // Assuming you have a users slice in Redux

  const fetchPublicTopics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public`);
      if (!response.ok) {
        throw new Error('Failed to fetch public topics');
      }
  
      const data = await response.json();
      if (!data) {
        throw new Error('Empty response received');
      }
  
      setPublicTopics(data);
    } catch (error) {
      console.error('Error fetching public topics:', error);
    }
  };

  useEffect(() => {
    fetchPublicTopics();
  }, [projectId]);
  console.log(publicTopics);
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="800"
        sx={{ mb: '0.5rem' }}
      >
        Public Topics
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem' }} />
    </WidgetWrapper>
  );
};

export default ProjectPublicTopicWidget;
