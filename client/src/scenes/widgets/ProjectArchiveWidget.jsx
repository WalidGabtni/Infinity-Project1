import React from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';

const ProjectArchiveWidget = () => {
  const { palette } = useTheme();

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="800"
        sx={{ mb: '0.5rem' }}
      >
        Project Archive
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem' }} />
      <Typography variant="body1" sx={{ color: palette.neutral.main }}>
        {/* Content for Project Archive */}
      </Typography>
    </WidgetWrapper>
  );
};

export default ProjectArchiveWidget;
