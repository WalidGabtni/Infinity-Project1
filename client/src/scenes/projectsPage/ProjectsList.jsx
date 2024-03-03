import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ProjectsList = ({ projects }) => (
  <>
    {projects && projects.length > 0 ? (
      projects.map((project) => (
        <Card key={project.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">Project Name: {project.name}</Typography>
            <Typography variant="body1">Project Description: {project.description}</Typography>
            {/* Add more project details as needed */}
          </CardContent>
        </Card>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No projects available.
      </Typography>
    )}
  </>
);

export default ProjectsList;
