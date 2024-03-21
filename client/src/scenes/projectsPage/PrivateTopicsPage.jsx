import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import Box from '@mui/material/Box'; // Import Box component from MUI

const PrivateTopicsPage = () => {
  const { projectId } = useParams();
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const userId = useSelector((state) => state.user?.id);

  return (
    <div>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis="71%">
          <ProjectProfileWidget project={project} userId={userId} /> 
        </Box>
        <Box flexBasis="30%"> {/* Adjust width as needed */}
          {/* Your content goes here */}
        </Box>
      </Box>
    </div>
  );
};

export default PrivateTopicsPage;
