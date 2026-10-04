import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const NavigationBreadcrumbsMembersPage = ({ projectId, projectName}) => {

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Typography component={Link} to="/home" color="inherit" style={{ textDecoration: 'none'}}>
        Home
      </Typography>
      <Typography component={Link} to="/projects" color="inherit" style={{ textDecoration: 'none'}}>
        Projects
      </Typography>
      <Typography component={Link} to={`/projects/${projectId}`} color="inherit" style={{ textDecoration: 'none' }}>
        {projectName}
      </Typography>
      <Typography style={{ textDecoration: 'none', fontWeight: 600 }}>
        Members
      </Typography>
    </Breadcrumbs>
  );
};

export default NavigationBreadcrumbsMembersPage;
