import * as React from 'react';
import { Card, Box, CardContent, Typography, Grid, Divider, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ProjectsList = ({ projects, loggedInUserId, onDeleteProject }) => (
  <Grid container spacing={2}>
    {projects && projects.length > 0 ? (
      projects.map((project) => (
        <Grid item key={project.id} xs={12} sm={6} md={6} lg={6}>
          <Card
            sx={{
              maxWidth: 800,
              margin: '0 auto',
              border: '1px solid black',
              position: 'relative', // Add position relative to create a stacking context
            }}
          >
            {/* Display the delete icon only for the user who posted the project */}
            {loggedInUserId === project.userId && (
              <IconButton
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                onClick={() => onDeleteProject(project._id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            )}

            <CardContent>
              <Typography variant="h5" component="div">
                Project Name: {project.name}
              </Typography>
              <Box m="0.2rem 0" />
              <Divider />
              <Box m="1rem 0" />
              <Typography variant="body2" color="text.secondary">
                Project Description: {project.description}
              </Typography>
              <Box m="3rem 0" />
              <Typography variant="body2" color="text.secondary">
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                End Date: {new Date(project.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Status: {project.currentStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(project.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updated At: {new Date(project.updatedAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary">
          No projects available.
        </Typography>
      </Grid>
    )}
  </Grid>
);

export default ProjectsList;
