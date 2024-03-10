// ProjectMemberWidget.jsx
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers } from 'state';
import ProjectMember from 'components/ProjectMember';

const ProjectMemberWidget = ({ projectId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const members = useSelector((state) => state.members); // Add this line to declare members

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
        variant="h5"
        fontWeight="500"
        sx={{ mb: '1.5rem' }}
      >
        Members List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(members) && members.map((member) => (
          <ProjectMember
            key={member._id}
            userId={member.userId}
            firstName={member.firstName}
            lastName={member.lastName}
            occupation={member.occupation}
            picturePath={member.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default ProjectMemberWidget;
