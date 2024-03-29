import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const PublicTopicsClickWidget = ({ projectId }) => {
  const [publicTopics, setPublicTopics] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // State variable to track anchor element for menu
  const [selectedTopicId, setSelectedTopicId] = useState(null); // State variable to track the selected topic ID
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
    setSelectedTopicId(topicId); // Set the selected topic ID when opening the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTopicId(null); // Clear the selected topic ID when closing the menu
  };

  const handleDeleteTopic = async (projectId, topicId, loggedInUserId) => {
    try {
      console.log('Deleting topic with ID:', topicId, 'in project:', projectId, 'by user ID:', loggedInUserId);
      
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      setPublicTopics(publicTopics.filter(topic => topic._id !== topicId));
      handleMenuClose();

      console.log('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleMenuItemClick = (projectId, topicId, loggedInUserId) => {
    console.log('Menu item clicked for topic ID:', topicId, 'in project:', projectId, 'by user ID:', loggedInUserId);
    handleDeleteTopic(projectId, topicId, loggedInUserId);
  };

  return (
    <WidgetWrapper sx={{ padding: '1.5rem' }}>
      {publicTopics.map((topic, index) => (
        <Box key={topic._id} sx={{ position: 'relative', mb: '1rem' }}>
          {loggedInUserId === topic.createdBy.userId && ( // Only render the three dots icon if the logged-in user is the creator of the topic
            <IconButton
              sx={{ position: 'absolute', top: -20, right: -20 }}
              onClick={(event) => handleMenuOpen(event, topic._id)} // Pass the topic ID when opening the menu
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Link to={`/projects/${projectId}/public-topics/${topic._id}`} style={{ textDecoration: 'none', display: 'inline-block' }}>
                <Typography variant="h3" sx={{ color: 'primary.main', mb: '0.5rem' }}>
                  {topic.title}
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
          {index !== publicTopics.length - 1 && <Divider variant="middle" />}
          <Menu
            anchorEl={anchorEl}
            open={selectedTopicId === topic._id} // Open the menu only for the selected topic
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick(projectId, topic._id, loggedInUserId)}>Delete</MenuItem>
          </Menu>
        </Box>
      ))}
    </WidgetWrapper>
  );
};

export default PublicTopicsClickWidget;
