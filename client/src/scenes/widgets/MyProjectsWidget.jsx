// MyProjectsWidget.jsx
import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectImage from 'components/ProjectImage';

const MyProjectsWidget = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects) ?? []; // Add nullish coalescing here
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Filter projects where the current user is a member
  const userProjects = projects.filter(
    (project) => project.members && project.members.some((member) => member.userId === user._id)
  );

  return (
   
    <WidgetWrapper sx={{border: '1px solid black'}}>
      <Typography color={theme.palette.neutral.dark} variant="h4" fontWeight="800" sx={{ mb: '0.5rem' }}>
        My Projects
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem'}} />

      {userProjects.length > 0 ? (
        userProjects.map((project) => (
          <Box
            key={project._id}
            display="flex"
            alignItems="center"
            gap="1rem"
            mb={1}
            sx={{ cursor: 'pointer' }}
            onClick={() => handleProjectClick(project._id)}
          >
            <ProjectImage image={project.projectImage} size="40px" />
            <Typography variant="subtitle1">{project.name}</Typography>
          </Box>
        ))
      ) : (
        <Typography color={theme.palette.neutral.medium} variant="body1">
          No projects found.
        </Typography>
      )}
    </WidgetWrapper>
  );
};

export default MyProjectsWidget;
