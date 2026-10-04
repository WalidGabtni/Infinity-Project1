// ProjectMember.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';

const ProjectMember = ({ userId, firstName, lastName, occupation, picturePath }) => {
  const navigate = useNavigate();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <FlexBetween>
      <FlexBetween gap="1rem" style={{ cursor: 'pointer' }}>
        <UserImage image={picturePath} size="55px" userId={userId} />
        <Box onClick={() => { navigate(`/profile/${userId}`); navigate(0); }}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              '&:hover': {
                color: palette.primary.light,
              },
            }}
          >
            {`${firstName} ${lastName}`}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {occupation}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default ProjectMember;
