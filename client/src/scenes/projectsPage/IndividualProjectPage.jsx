// IndividualProjectPage.jsx
import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import ProjectMemberWidget from 'scenes/widgets/ProjectMemberWidget'; 

const IndividualProjectPage = () => {
  const { projectId } = useParams();

  return (
    <Box>
      <Navbar/>
      <h1>Individual Project Page</h1>
      <p>Project ID: {projectId}</p>
      
      {/* Add MembersListWidget with the projectId */}
      <ProjectMemberWidget projectId={projectId} />
    </Box>
  );
};

export default IndividualProjectPage;
