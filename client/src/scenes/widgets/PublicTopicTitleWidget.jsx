import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useParams } from 'react-router-dom';

const PublicTopicTitleWidget = () => {
  const { projectId, topicId } = useParams(); // Extract projectId and topicId from URL parameters
  const [topicTitle, setTopicTitle] = useState('');

  useEffect(() => {
    const fetchTopicTitle = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topic details');
        }
      
        const data = await response.json();
        setTopicTitle(data.title); // Update state with the fetched topic title
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };

    fetchTopicTitle();
  }, [projectId, topicId]);

  return (
    <WidgetWrapper>
      <Box sx={{ mb: '0.5rem' }}>
        <Typography variant="h3" sx={{ color: 'primary.main' }}>{topicTitle}</Typography>
      </Box>
      <Divider variant="fullWidth" />
    </WidgetWrapper>
  );
};

export default PublicTopicTitleWidget;
