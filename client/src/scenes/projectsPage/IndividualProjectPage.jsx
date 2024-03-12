// IndividualProjectPage.jsx
import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import the useSelector hook
import Navbar from 'scenes/navbar';
import ProjectDescriptionWidget from 'scenes/widgets/ProjectDescriptionWidget';
import ProjectMemberWidget from 'scenes/widgets/ProjectMemberWidget';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';

const IndividualProjectPage = () => {

  const { projectId } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

    // Use the useSelector hook to get the 'projects' array from the Redux store
    const projects = useSelector((state) => state.projects);
   // Fetch the project based on the projectId from your projects state
   const project = projects.find((project) => project._id === projectId);

   console.log('Project ID:', projectId); // Log the project ID

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
          <ProjectProfileWidget project={project} />
          <Box m="2rem 0" />
          <ProjectDescriptionWidget projectId={projectId} />
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
