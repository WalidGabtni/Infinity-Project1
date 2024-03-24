import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage'; // Import the UserImage component
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PublicTopicsClickWidget = ({ projectId }) => {
  const [publicTopics, setPublicTopics] = useState([]);
  const users = useSelector((state) => state.users); // Assuming you have a users slice in Redux

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

  return (
    <WidgetWrapper>
        {publicTopics.map((topic, index) => (
        <Box key={topic._id} sx={{ mb: '1rem' }}>

            <Link to={`/projects/${projectId}/public-topics/${topic._id}`} style={{ textDecoration: 'none' }}>
            <Typography variant="h3" sx={{ color: 'primary.main' }}>
                {topic.title}
            </Typography>
            </Link>


            <Typography variant="body1" sx={{ color: 'neutral.main' }} dangerouslySetInnerHTML={{ __html: topic.content }} />
          {topic.userId && users[topic.userId] && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '0.5rem' }}>
              <UserImage image={users[topic.userId].picturePath} size="30px" />
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                {users[topic.userId].firstName} {users[topic.userId].lastName}
              </Typography>
            </Box>
          )}
          {index !== publicTopics.length - 1 && <Divider variant="middle" />}
        </Box>
      ))}
    </WidgetWrapper>
  );
};

export default PublicTopicsClickWidget;
