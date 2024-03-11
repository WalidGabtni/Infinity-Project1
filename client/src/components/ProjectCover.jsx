import React from 'react';
import { Box } from '@mui/material';

const ProjectCover = ({ image, size = '100px' }) => {
  const imageName = image ? image.replace('/assets/', '') : null;
  const imageUrl = imageName ? `http://localhost:3001/assets/${imageName}` : null;

  const coverStyle = {
    width: '475px', // Adjust the width as needed
    height: size,
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundSize: 'cover', // Maintain aspect ratio and cover the container
    backgroundPosition: 'center center',
  };
  

  return (
    <Box style={coverStyle}>
      {/* You can add additional content or styles here if needed */}
    </Box>
  );
};

export default ProjectCover;
