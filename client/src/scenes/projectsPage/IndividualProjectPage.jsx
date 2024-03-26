import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import ProjectDescriptionWidget from 'scenes/widgets/ProjectDescriptionWidget';
import ProjectMemberWidget from 'scenes/widgets/ProjectMemberWidget';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';
import NavBreadcrumbsIndividual from 'components/NavBreadcrumbsIndividual';

const IndividualProjectPage = () => {
  const { projectId } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const projects = useSelector((state) => state.projects);
  const userId = useSelector((state) => state.user?.id); // Accessing userId from state.user.id

  console.log("UserId:", userId); // Log userId to check its value

  const project = projects.find((project) => project._id === projectId);

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
        <NavBreadcrumbsIndividual projectId={projectId} projectName={project.name}/>
        <Box m="2rem 0" />
          <ProjectProfileWidget project={project} userId={userId} /> 
          <Box m="2rem 0" />
          <ProjectDescriptionWidget projectId={projectId} />
          <Box m="2rem 0" />
          <NavBreadcrumbsIndividual projectId={projectId} projectName={project.name}/>
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="28%">
            <ProjectMemberWidget projectId={projectId} />
          </Box>
        )}
      </Box>
      
    </Box>
  );
};

export default IndividualProjectPage;
