import React from 'react';
import { Typography, Avatar, Button, Box } from '@mui/material';
import UserImage from './UserImage'; // Import the UserImage component

const NotificationMenu = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return <Typography>No notifications</Typography>;
  }

  const handleAccept = (notificationId) => {
    // Handle accept action here
    console.log('Accepting notification:', notificationId);
  };

  return (
    <div style={{ padding: '16px' }}>
      {notifications.map((notification, index) => (
        <Box key={index} display="flex" alignItems="flex-start" marginBottom="16px"> {/* Adjusted alignItems */}
          <Avatar>
            <UserImage image={notification.sender.picturePath} size="40px" />
          </Avatar>
          <Box marginLeft="16px">
            <Typography variant="h6" gutterBottom>
              {notification.sender.firstName} {notification.sender.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              wants to join "{notification.project.name}"
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAccept(notification.id)}
              style={{ marginTop: '16px' }}
            >
              Accept
            </Button>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default NotificationMenu;
