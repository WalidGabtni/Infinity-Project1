import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PinIcon from '@mui/icons-material/PushPin';
import Tooltip from '@mui/material/Tooltip';
import LockIcon from '@mui/icons-material/Lock';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TopicPostForm from 'components/TopicPostForm';

const PrivateTopicsClickWidget = ({ projectId }) => {
  const [privateTopics, setPrivateTopics] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const project = useSelector((state) => state.projects.find((project) => project._id === projectId));
  const projectOwnerId = project?.userId;

  const fetchPrivateTopics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/private`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch private topics');
      }
  
      const data = await response.json();
      setPrivateTopics(data);
    } catch (error) {
      console.error('Error fetching private topics:', error);
    }
  };
  
  useEffect(() => {
    fetchPrivateTopics();
  }, [projectId, token]);

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
      setSelectedTopicId(topicId);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const confirmDeleteTopic = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/private/${selectedTopicId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      setPrivateTopics(privateTopics.filter((topic) => topic._id !== selectedTopicId));
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
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/private/${topicId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    if (action === 'delete') {
      handleDeleteTopic(projectId, topicId, loggedInUserId);
    } else if (action === 'edit') {
      handleEditTopic(topicId);
    }
  };

  const handlePost = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/private/${formData._id}/update`, {
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
      setPrivateTopics(privateTopics.map((topic) => (topic._id === updatedTopic._id ? updatedTopic : topic)));
      console.log('Topic updated successfully:', updatedTopic);
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  if (!loggedInUserId || !project || !projectOwnerId || !projectOwnerId === loggedInUserId) {
    return (
      <WidgetWrapper>
        <Typography variant="body1">You have to be a member or the owner to access this page.</Typography>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper sx={{ padding: '1.5rem' }}>
      {privateTopics.map((topic, index) => {
        if (topic.hidden && loggedInUserId !== projectOwnerId) {
          return null; // Skip rendering for hidden topics if not the project owner
        }

        return (
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
                <Link to={`/projects/${projectId}/private-topics/${topic._id}`} style={{ textDecoration: 'none', display: 'inline-block' }}>
                  <Typography variant="h3" sx={{ color: 'primary.main', mb: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    {topic.pinned && (
                      <Tooltip title="Pinned Topic" arrow>
                        <PinIcon sx={{ marginRight: '0.3rem', color: 'green', borderRadius: '50%' }} />
                      </Tooltip>
                    )}
                    {topic.locked && (
                      <Tooltip title="Locked Topic" arrow>
                        <LockIcon sx={{ marginRight: '0.3rem', borderRadius: '50%' }} />
                      </Tooltip>
                    )}
                    {topic.title}
                    {topic.hidden && loggedInUserId === projectOwnerId && (
                      <Typography variant="body2" sx={{ color: 'white', marginLeft: '0.5rem' }}>
                        (Hidden Topic)
                      </Typography>
                    )}
                  </Typography>
                </Link>
                <Typography variant="body1" sx={{ color: 'neutral.main', mb: '0.5rem' }} dangerouslySetInnerHTML={{ __html: topic.content }} />
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
            {index !== privateTopics.length - 1 && <Divider variant="middle" />}
            <Menu
              anchorEl={anchorEl}
              open={selectedTopicId === topic._id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuItemClick(projectId, topic._id, loggedInUserId, 'delete')}>Delete</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(projectId, topic._id, loggedInUserId, 'edit')}>Edit</MenuItem>
            </Menu>
          </Box>
        );
      })}
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

export default PrivateTopicsClickWidget;
