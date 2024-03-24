import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';

const ProjectPublicTopicWidget = ({ projectId }) => {
  const { palette } = useTheme();
  const [publicTopics, setPublicTopics] = useState([]);
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
      {publicTopics.map((topic, index) => (
        <Box key={topic._id}>
          <Typography variant="body1" sx={{ color: palette.neutral.main }}>
            {topic.title}
          </Typography>
          <Typography variant="body2" sx={{ color: palette.neutral.secondary }}>
            {topic.content}
          </Typography>
          {index !== publicTopics.length - 1 && <Divider variant="middle" />}
        </Box>
      ))}
    </WidgetWrapper>
  );
};

export default ProjectPublicTopicWidget;
