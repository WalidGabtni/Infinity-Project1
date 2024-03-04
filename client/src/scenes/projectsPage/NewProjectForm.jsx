import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import { Box, Typography, Button, TextField, IconButton, useTheme } from '@mui/material';
import Overlay from 'components/Overlay';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from 'state';
import { CloseOutlined } from '@mui/icons-material';

const NewProjectForm = ({ onClose }) => {
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editor, setEditor] = useState(null);
  const [projectImage, setProjectImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({ ...prevProject, [name]: value }));
  };

  const handleImageChange = (acceptedFiles) => {
    const selectedImage = acceptedFiles[0];
    if (selectedImage) {
      setImage(selectedImage);
      setProjectImage(selectedImage);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  

  const handleCreateProject = async () => {
    try {
      if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.endDate || !projectImage) {
        console.error('Please fill in all required fields', newProject);
        return;
      }

      const projectData = {
        userId: _id,
        name: newProject.name,
        description: newProject.description,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        projectImage: newProject.projectImage,
      };
  
      const response = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        console.error(`Failed to create project. Server returned ${response.status}: ${response.statusText}`);
        const errorResponse = await response.json();
        console.error('Error details:', errorResponse);
        return;
      }

      const createdProject = await response.json();
      dispatch(setProjects([createdProject]));
      setImage(null);

      console.log('Project created successfully:', createdProject);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleImageUpload = () => {
    if (editor && image) {
      const canvas = editor.getImage();
      // You can now send the canvas data to the server along with other project details
    }
  };

  return (
    <>
      <Overlay>
        <Box
          width="80%"
          height="80vh"
          backgroundColor={palette.background.paper}
          padding="1rem"
          borderRadius="8px"
          position="fixed"
          top="10%"
          left="10%"
          zIndex="999"
          overflow="auto"
        >
          <Typography variant="h6" gutterBottom>
            Create a New Project
          </Typography>
          <Box mb={1}>
            <Typography variant="subtitle1">Project Name</Typography>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              value={newProject.name}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
          </Box>
          <Box mb={1}>
            <Typography variant="subtitle1">Project Description</Typography>
            <TextField
              name="description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={newProject.description}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
          </Box>
          <Box mb={1}>
            <Typography variant="subtitle1">Start Date</Typography>
            <TextField
              name="startDate"
              type="date"
              variant="outlined"
              fullWidth
              value={newProject.startDate}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
          </Box>
          <Box mb={1}>
            <Typography variant="subtitle1">End Date</Typography>
            <TextField
              name="endDate"
              type="date"
              variant="outlined"
              fullWidth
              value={newProject.endDate}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
          </Box>
          <Box mb={1}>
            <Typography variant="subtitle1">Project Image</Typography>
            <Dropzone onDrop={handleImageChange}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px' }}>
                  <input {...getInputProps()} />
                  <Typography variant="body2">Drag 'n' drop an image here, or click to select one.</Typography>
                </div>
              )}
            </Dropzone>
            {image && (
              <div>
                <Box m="1rem 0" />
                <Typography variant="body2">Preview:</Typography>
                <AvatarEditor
                  ref={(editor) => setEditor(editor)}
                  image={imagePreview}
                  width={500}
                  height={500}
                  border={50}
                  borderRadius={100}
                  color={[255, 255, 255, 0.6]}
                  scale={1.2}
                />
              </div>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProject}
            disabled={!newProject.name || !newProject.startDate || !newProject.endDate || !image}
            sx={{ mt: 2 }}
          >
            Create Project
          </Button>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: '1rem', right: '1rem', padding: 1 }}>
            <CloseOutlined />
          </IconButton>
        </Box>
      </Overlay>
    </>
  );
};

export default NewProjectForm;