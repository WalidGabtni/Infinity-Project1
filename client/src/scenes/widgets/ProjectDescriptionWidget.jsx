// ProjectDescriptionWidget.jsx
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setDescription } from 'state';

const ProjectDescriptionWidget = ({ projectId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const description = useSelector((state) => state.description);

  const getDescription = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/description`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data from API:', data); // Log the data to inspect its structure
      dispatch(setDescription({ description: data.description }));
    } catch (error) {
      console.error('Error fetching description:', error.message);
    }
  }, [projectId, token, dispatch]);

  useEffect(() => {
    getDescription();
  }, [getDescription]);

  // Check if description is an object and extract the relevant property
  const renderedDescription = typeof description === 'object' ? description.description : description;

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="800"
        sx={{ mb: '0.5rem' }}
      >
        Project Description
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem' }} />
      <Typography variant="body1" sx={{ color: palette.neutral.main }}>
        {renderedDescription || 'No description available.'}
      </Typography>
    </WidgetWrapper>
  );
};

export default ProjectDescriptionWidget;
