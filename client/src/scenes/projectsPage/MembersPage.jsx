import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import ProjectMemberWidget from 'scenes/widgets/ProjectMemberWidget'; // Import ProjectMemberWidget
import Box from '@mui/material/Box'; // Import Box component from MUI
import ProjectMemberListWidget from 'scenes/widgets/ProjectMemberListWidget';
import NavigationBreadcrumbsMembersPage from 'components/NavigationBreadcrumbsMembersPage';

const MembersPage = () => {
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
        <Box flexBasis="70%">
        <NavigationBreadcrumbsMembersPage projectId={projectId} projectName={project.name} />
          <Box m="2rem 0" />
          <ProjectProfileWidget project={project} userId={userId} /> 
          <Box m="2rem 0" />
          <ProjectMemberListWidget projectId={projectId}  />
          <Box m="2rem 0" />
          <NavigationBreadcrumbsMembersPage projectId={projectId} projectName={project.name} />
        </Box>
        <Box flexBasis="28%"> 
          <ProjectMemberWidget projectId={projectId} /> 
        </Box>
      </Box>
    </div>
  );
};

export default MembersPage;
