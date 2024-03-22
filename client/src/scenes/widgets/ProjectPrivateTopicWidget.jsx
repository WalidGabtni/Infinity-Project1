// ProjectPrivateTopicWidget.jsx

import React from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';

const ProjectPrivateTopicWidget = ({ projectId }) => {
  const { palette } = useTheme();
  
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="800"
        sx={{ mb: '0.5rem' }}
      >
        Private Topics
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem' }} />
      <Typography variant="body1" sx={{ color: palette.neutral.main }}>
        {/* Content for Private Topics */}
      </Typography>
    </WidgetWrapper>
  );
};

export default ProjectPrivateTopicWidget; 
