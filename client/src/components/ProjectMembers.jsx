import React from 'react';
import { Card, Typography, useTheme, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import UserImage from './UserImage';

const ProjectMembers = ({ userId, firstName, lastName, picturePath }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;

  return (
    <Card 
      sx={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        border: '1px solid black', 
        borderRadius: '4px', // Optional: if you want rounded corners
        position: 'relative', 
        backgroundColor: 'transparent', // Ensure no background color
        boxShadow: 'none', // Ensure no box shadow
        height: '150px', // Adjust height as needed
      }}
    >
      <FlexBetween 
        onClick={() => { navigate(`/profile/${userId}`); navigate(0); }} 
        style={{ cursor: 'pointer' }} 
        flexDirection="column" 
        alignItems="center"
        p={2} // Optional: Add padding if needed
      >
        <UserImage image={picturePath} size="55px" userId={userId} />
        <Typography
          color={main}
          variant="h5"
          fontWeight="500"
          textAlign="center"
          sx={{ marginTop: '1rem', '&:hover': { color: palette.primary.light } }}
        >
          <span style={{ '&:hover': { color: palette.primary.light } }}>
            {firstName}
          </span>{' '}
          <span style={{ '&:hover': { color: palette.primary.light } }}>
            {lastName}
          </span>
        </Typography>
        <Divider sx={{ width: '100%', margin: '0 auto' }} /> {/* Add a divider */}
      </FlexBetween>
    </Card>
  );
};

export default ProjectMembers;
