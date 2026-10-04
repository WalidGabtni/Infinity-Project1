import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const PrivateNavigationBreadcrumbs = ({ projectId, projectName, topicName }) => {

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Typography component={Link} to="/home" color="inherit" style={{ textDecoration: 'none' }}>
        Home
      </Typography>
      <Typography component={Link} to="/projects" color="inherit" style={{ textDecoration: 'none'}}>
        Projects
      </Typography>
      <Typography component={Link} to={`/projects/${projectId}`} color="inherit" style={{ textDecoration: 'none' }}>
        {projectName}
      </Typography>
      <Typography component={Link} to={`/projects/${projectId}/private-topics`} color="inherit" style={{ textDecoration: 'none'}}>
        Private Topics
      </Typography>

        <Typography style={{ fontWeight: 600 }}>
          {topicName}
        </Typography>

    </Breadcrumbs>
  );
};

export default PrivateNavigationBreadcrumbs;
