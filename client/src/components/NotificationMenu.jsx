import React from 'react';
import { Typography, Avatar } from '@mui/material';
import UserImage from './UserImage'; // Import the UserImage component

const NotificationMenu = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return <Typography>No notifications</Typography>;
  }

  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Avatar>
            <UserImage image={notification.sender.picturePath} size="40px" /> {/* Render the sender's image */}
          </Avatar>
          <div style={{ marginLeft: '8px' }}>
            <Typography variant="body1">
              {notification.sender.firstName} {notification.sender.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              wants to join "{notification.project.name}"
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationMenu;
