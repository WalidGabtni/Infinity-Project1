// ProjectImage.jsx
import React from 'react';
import { Box } from "@mui/material";

const ProjectImage = ({ image, size = "60px" }) => {
  const imageName = image ? image.replace('/assets/', '') : null;
  const imageUrl = imageName ? `http://localhost:3001/assets/${imageName}` : null;

  return (
    <Box width={size} height={size}>
      {imageUrl ? (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="project"
          src={imageUrl}
        />
      ) : (
        // Render a placeholder or a default image when 'image' is undefined or null
        <div style={{ width: size, height: size, backgroundColor: "#ccc", borderRadius: "50%" }}></div>
      )}
    </Box>
  );
};

export default ProjectImage;
