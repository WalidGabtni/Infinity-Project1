import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PinIcon from '@mui/icons-material/PushPin'; // Import PinIcon
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import TopicPostForm from 'components/TopicPostForm';

const PublicTopicsClickWidget = ({ projectId }) => {
  const [publicTopics, setPublicTopics] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  const fetchPublicTopics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public`);
      if (!response.ok) {
        throw new Error('Failed to fetch public topics');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Empty response received');
      }

      setPublicTopics(data);
    } catch (error) {
      console.error('Error fetching public topics:', error);
    }
  };

  useEffect(() => {
    fetchPublicTopics();
  }, [projectId]);

  const getTimeElapsed = (createdAt) => {
    const currentTime = new Date();
    const creationTime = new Date(createdAt);
    const timeDifference = currentTime - creationTime;
    const minutesElapsed = Math.floor(timeDifference / (1000 * 60));
    const hoursElapsed = Math.floor(minutesElapsed / 60);
    const daysElapsed = Math.floor(hoursElapsed / 24);

    if (daysElapsed > 0) {
      return `${daysElapsed} day${daysElapsed !== 1 ? 's' : ''} ago`;
    } else if (hoursElapsed > 0) {
      return `${hoursElapsed} hour${hoursElapsed !== 1 ? 's' : ''} ago`;
    } else {
      return `${minutesElapsed} minute${minutesElapsed !== 1 ? 's' : ''} ago`;
    }
  };

  const handleMenuOpen = (event, topicId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTopicId(topicId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTopicId(null);
  };

  const handleDeleteTopic = async (projectId, topicId, loggedInUserId) => {
    try {
      setIsConfirmationOpen(true);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const confirmDeleteTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${selectedTopicId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      setPublicTopics(publicTopics.filter(topic => topic._id !== selectedTopicId));
      handleMenuClose();

      console.log('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
    } finally {
      setIsConfirmationOpen(false);
    }
  };

  const handleEditTopic = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch topic details for editing');
      }

      const topicData = await response.json();
      setEditFormData(topicData);
    } catch (error) {
      console.error('Error fetching topic details for editing:', error);
    }
  };

  const handleMenuItemClick = (projectId, topicId, loggedInUserId, action) => {
    console.log('Menu item clicked for topic ID:', topicId, 'in project:', projectId, 'by user ID:', loggedInUserId);
    if (action === 'delete') {
      handleDeleteTopic(projectId, topicId, loggedInUserId);
    } else if (action === 'edit') {
      handleEditTopic(topicId);
    }
  };
  
  const handlePost = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${formData._id}/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update topic');
      }

      const updatedTopic = await response.json();
      setPublicTopics(publicTopics.map(topic => topic._id === updatedTopic._id ? updatedTopic : topic));
      console.log('Topic updated successfully:', updatedTopic);
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return (
    <WidgetWrapper sx={{ padding: '1.5rem' }}>
      {publicTopics.map((topic, index) => (
        <Box key={topic._id} sx={{ position: 'relative', mb: '1rem' }}>
          {loggedInUserId === topic.createdBy.userId && (
            <IconButton
              sx={{ position: 'absolute', top: -20, right: -20 }}
              onClick={(event) => handleMenuOpen(event, topic._id)}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Link to={`/projects/${projectId}/public-topics/${topic._id}`} style={{ textDecoration: 'none', display: 'inline-block' }}>
                <Typography variant="h3" sx={{ color: 'primary.main', mb: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  {topic.pinned && <PinIcon sx={{ marginRight: '0.5rem' }} />} {topic.title}
                </Typography>
              </Link>
              <div style={{ 
                color: 'neutral.main', 
                marginBottom: '0.5rem',
                maxWidth: '125ch',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }} dangerouslySetInnerHTML={{ __html: topic.content }} />

            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Link to={`/profile/${topic.createdBy.userId}`} style={{ textDecoration: 'none' }}>
                    <UserImage image={topic.createdBy.picturePath} size="50px" />
                  </Link>
                  <Link to={`/profile/${topic.createdBy.userId}`} style={{ textDecoration: 'none', display: 'inline-block', marginLeft: '0.5rem' }}>
                    <Typography variant="body2" sx={{ color: 'white', mt: '0.5rem', fontSize: '1.1rem' }}>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{topic.createdBy.firstName}</span> <span style={{ color: 'white', fontSize: '1.1rem' }}>{topic.createdBy.lastName}</span>
                    </Typography>
                  </Link>
                </Box>
                <Typography variant="body2" sx={{ color: 'white', mt: '0.5rem' }}>
                  {getTimeElapsed(topic.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          {index !== publicTopics.length - 1 && <Divider variant="middle" />}
          <Menu
            anchorEl={anchorEl}
            open={selectedTopicId === topic._id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick(projectId, topic._id, loggedInUserId, 'delete')}>Delete</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(projectId, topic._id, loggedInUserId, 'edit')}>Edit</MenuItem>
          </Menu>
        </Box>
      ))}
      <Dialog open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this topic?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmationOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTopic} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      {editFormData && (
        <TopicPostForm
          onClose={() => setEditFormData(null)}
          onPost={handlePost}
          initialFormData={editFormData}
          userId={loggedInUserId}
          editMode={true}
        />
      )}
    </WidgetWrapper>
  );
};

export default PublicTopicsClickWidget;
