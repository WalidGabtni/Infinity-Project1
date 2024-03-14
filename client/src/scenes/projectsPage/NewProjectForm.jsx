import React, { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import { Box, Typography, Button, TextField, IconButton, useTheme } from '@mui/material';
import Overlay from 'components/Overlay';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from 'state';
import { CloseOutlined } from '@mui/icons-material';

const NewProjectForm = ({ onClose, editProjectId }) => {
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

  const [projectCover, setProjectCover] = useState(null);
  const [projectCoverPreview, setProjectCoverPreview] = useState('');
  const [coverEditor, setCoverEditor] = useState(null);

  useEffect(() => {
    console.log('Fetching project for editing with ID:', editProjectId);
    const fetchProjectForEdit = async () => {
      try {
        if (editProjectId) {
          const response = await fetch(`http://localhost:3001/projects/${editProjectId}`, {
            method: 'PATCH', // Use GET method for fetching project details
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            // Set the project details for editing
            setNewProject({
              name: data.name,
              description: data.description,
              startDate: data.startDate,
              endDate: data.endDate,
            });
            setProjectImage(data.projectImage);
            setImagePreview(data.projectImage);
            setProjectCover(data.projectCover);
            setProjectCoverPreview(data.projectCover);
          } else {
            console.error('Failed to fetch project for editing:', response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching project for editing:', error);
      }
    };

    fetchProjectForEdit();
  }, [editProjectId, token]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    // Handle regular input fields
    if (type !== 'file') {
      setNewProject((prevProject) => ({ ...prevProject, [name]: value }));
      return;
    }
  
    // Handle file inputs (assuming single file inputs for simplicity)
    const file = files && files.length > 0 ? files[0] : null;
  
    if (name === 'projectImage') {
      setProjectImage(file);
      handleImageChange(files); // Assuming handleImageChange accepts acceptedFiles
    } else if (name === 'projectCover') {
      setProjectCover(file);
      handleCoverChange(files); // Assuming handleCoverChange accepts acceptedFiles
    }
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
      if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.endDate || !projectImage || !projectCover) {
        console.error('Please fill in all required fields', newProject);
        return;
      }
  
      const formData = new FormData();
      formData.append('userId', _id);
      formData.append('name', newProject.name);
      formData.append('description', newProject.description);
      formData.append('startDate', newProject.startDate);
      formData.append('endDate', newProject.endDate);
      formData.append('projectImage', projectImage);
      formData.append('projectCover', projectCover);

      const response = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
      onClose(); // Close the form after creating a Project
      // Reload the page after creating the project
       window.location.reload();
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      // Validate required fields
      if (
        !editProjectId ||
        !newProject.name ||
        !newProject.description ||
        !newProject.startDate ||
        !newProject.endDate ||
        !projectImage ||
        !projectCover
      ) {
        console.error('Please provide a valid project ID and fill in all required fields:', {
          editProjectId,
          projectName: newProject.name,
          projectDescription: newProject.description,
          startDate: newProject.startDate,
          endDate: newProject.endDate,
          projectImage,
          projectCover,
        });
        return;
      }
  
      // Format dates to "yyyy-MM-dd"
      const formattedStartDate = new Date(newProject.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(newProject.endDate).toISOString().split('T')[0];
  
      // Create a FormData object to handle file uploads for image
      const imageFormData = new FormData();
      imageFormData.append('projectImage', projectImage);
  
      // Make a POST request to the server for image upload
      const imageUploadResponse = await fetch('http://localhost:3001/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      });
  
      if (!imageUploadResponse.ok) {
        console.error('Failed to upload project image. Server returned:', imageUploadResponse.status, imageUploadResponse.statusText);
        return;
      }
  
      // Get the new image path from the response
      const newImagePath = await imageUploadResponse.json();
  
      // Create a FormData object to handle file uploads for cover
      const coverFormData = new FormData();
      coverFormData.append('projectCover', projectCover);
  
      // Make a POST request to the server for cover upload
      const coverUploadResponse = await fetch('http://localhost:3001/upload-cover', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: coverFormData,
      });
  
      if (!coverUploadResponse.ok) {
        console.error('Failed to upload project cover. Server returned:', coverUploadResponse.status, coverUploadResponse.statusText);
        return;
      }
  
      // Get the new cover path from the response
      const newCoverPath = await coverUploadResponse.json();
  
      // Prepare the updated project data
      const updatedProjectData = {
        name: newProject.name,
        description: newProject.description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        projectImage: newImagePath.filename, // Assuming your server responds with the new image path
        projectCover: newCoverPath.filename, // Assuming your server responds with the new cover path
      };
  
      // Make a PATCH request to update the project with new image paths
      const response = await fetch(`http://localhost:3001/projects/${editProjectId}`, {
        method: 'PATCH', // Use PATCH for updating projects
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProjectData),
      });
  
      if (!response.ok) {
        console.error(`Failed to update project. Server returned ${response.status}: ${response.statusText}`);
        return;
      }
  
      const updatedProject = await response.json();
      dispatch(setProjects([updatedProject]));
  
      console.log('Project updated successfully:', updatedProject);
      onClose(); // Close the form after updating a project
      // Reload the page after updating the project
      window.location.reload();
    } catch (error) {
      console.error('An unexpected error occurred during project update:', error);
    }
  };
  
  
  const handleImageUpload = async () => {
    try {
      if (editor && image) {
        const canvas = editor.getImage();
  
        // Convert the canvas data to a Blob (image file)
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Create a FormData object to handle file uploads
            const formData = new FormData();
            formData.append('projectImage', blob);
  
            // Make a POST request to the server for image upload
            const response = await fetch('http://localhost:3001/upload-image', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
  
            if (response.ok) {
              const imagePath = await response.json();
              setProjectImage(imagePath.filename);
              console.log('Image uploaded successfully:', imagePath);
            } else {
              console.error(`Failed to upload image. Server returned ${response.status}: ${response.statusText}`);
            }
          }
        }, 'image/jpeg'); // Adjust the format as needed
      }
    } catch (error) {
      console.error('An unexpected error occurred during image upload:', error);
    }
  };
  

  const handleCoverChange = (acceptedFiles) => {
    const selectedCover = acceptedFiles[0];
    if (selectedCover) {
      setProjectCover(selectedCover);
      const reader = new FileReader();
      reader.onload = () => {
        setProjectCoverPreview(reader.result);
      };
      reader.readAsDataURL(selectedCover);
    }
  };

  const handleCoverUpload = async () => {
    try {
      if (coverEditor && projectCover) {
        const coverCanvas = coverEditor.getImage();
  
        // Convert the canvas data to a Blob (cover image file)
        coverCanvas.toBlob(async (blob) => {
          if (blob) {
            // Create a FormData object to handle file uploads
            const formData = new FormData();
            formData.append('projectCover', blob);
  
            // Make a POST request to the server for cover image upload
            const response = await fetch('http://localhost:3001/upload-cover', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
  
            if (response.ok) {
              const coverPath = await response.json();
              setProjectCover(coverPath.filename);
              console.log('Cover image uploaded successfully:', coverPath);
            } else {
              console.error(`Failed to upload cover image. Server returned ${response.status}: ${response.statusText}`);
            }
          }
        }, 'image/jpeg'); // Adjust the format as needed
      }
    } catch (error) {
      console.error('An unexpected error occurred during cover image upload:', error);
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
            {editProjectId ? 'Update Project' : 'Create a New Project'}
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
          <Box mb={1}>
        <Typography variant="subtitle1">Project Cover</Typography>
        <Dropzone onDrop={handleCoverChange}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px' }}>
              <input {...getInputProps()} />
              <Typography variant="body2">Drag 'n' drop an image here, or click to select one.</Typography>
            </div>
          )}
        </Dropzone>
        {projectCover && (
          <div>
            <Box m="1rem 0" />
            <Typography variant="body2">Preview:</Typography>
            <AvatarEditor
              ref={(editor) => setCoverEditor(editor)}
              image={projectCoverPreview}
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
            onClick={editProjectId ? handleUpdateProject : handleCreateProject}
            disabled={!newProject.name || !newProject.startDate || !newProject.endDate || !image}
            sx={{ mt: 2 }}
          >
            {editProjectId ? 'Update Project' : 'Create Project'}
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