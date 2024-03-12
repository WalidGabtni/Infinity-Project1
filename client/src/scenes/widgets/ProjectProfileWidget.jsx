// ProjectProfileWidget.jsx
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ProjectImage from 'components/ProjectImage';
import ProjectCover from 'components/ProjectCover';
import WidgetWrapper from 'components/WidgetWrapper';

const ProjectProfileWidget = ({ project }) => {
  if (!project) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Project Not Found
        </Typography>
      </Box>
    );
  }

  const { projectImage, projectCover, name } = project;

  return (
    <WidgetWrapper>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <ProjectCover image={projectCover} size="150px" width="100%" /> {/* Adjust width here */}
        <Box position="absolute" top="40px" left="40px">
          <ProjectImage image={projectImage} size="80px" />
        </Box>
        <Box position="absolute" top="60px" left="140px" style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
          <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: 'white' }}>
            {name}
          </Typography>
        </Box>

        <Box m="1rem 0" />
      </Box>
    </WidgetWrapper>
  );
};

export default ProjectProfileWidget;
