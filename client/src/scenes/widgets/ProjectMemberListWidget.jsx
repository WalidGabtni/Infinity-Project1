import React, { useEffect, useCallback } from 'react';
import { Box, Typography, useTheme, Divider, Grid } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper'; 
import { setMembers } from 'state';
import { useDispatch, useSelector } from 'react-redux';
import ProjectMembers from 'components/ProjectMembers';

const ProjectMemberListWidget = ({ projectId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const members = useSelector((state) => state.members);

  const getMembers = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setMembers({ members: data }));
    } catch (error) {
      console.error('Error fetching members:', error.message);
    }
  }, [projectId, token, dispatch]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);
  
  return (
    <WidgetWrapper> 
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="800"
        sx={{ mb: '0.5rem' }}
      >
        Project Members
      </Typography>
      <Divider variant="fullWidth" />
      <Box sx={{ mb: '1rem' }} />
      <WidgetWrapper>
      <Grid container spacing={2}>
        {members.map((member) => (
          <Grid item key={member._id} xs={12} sm={6} md={4} lg={3}>
            <Box >
              <ProjectMembers
                userId={member.userId}
                firstName={member.firstName}
                lastName={member.lastName}
                picturePath={member.picturePath}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      </WidgetWrapper>
    </WidgetWrapper>
  );
};

export default ProjectMemberListWidget;
