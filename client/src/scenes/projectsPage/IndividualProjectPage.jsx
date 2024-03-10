// IndividualProjectPage.jsx
import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import ProjectMemberWidget from 'scenes/widgets/ProjectMemberWidget';

const IndividualProjectPage = () => {
  const { projectId } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? '70%' : undefined}>
          <h1>Individual Project Page</h1>
          <p>Project ID: {projectId}</p>
          {/* Content of the project page */}
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* You can adjust the spacing and add other widgets if needed */}
            <ProjectMemberWidget projectId={projectId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default IndividualProjectPage;
