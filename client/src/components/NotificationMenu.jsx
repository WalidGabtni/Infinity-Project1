// NotificationMenu.jsx

import React from 'react';
import { Typography, Avatar, Button, Box, Divider } from '@mui/material';
import UserImage from './UserImage'; // Import the UserImage component

const NotificationMenu = ({ notifications, handleAccept, loggedInUserId }) => {
  // Filter out notifications with status "accepted"
  const filteredNotifications = notifications.filter(notification => notification.status !== 'accepted');

  if (!filteredNotifications || filteredNotifications.length === 0) {
    return <Typography>No notifications</Typography>;
  }

  return (
    <div style={{ padding: '16px' }}>
      {filteredNotifications.map((notification, index) => (
        <React.Fragment key={index}>
          <Box display="flex" alignItems="flex-start" marginBottom="16px">
            <Avatar>
              <UserImage image={notification.sender?.picturePath} size="40px" />
            </Avatar>
            <Box marginLeft="16px">
              <Typography variant="h6" gutterBottom>
                {notification.sender?.firstName} {notification.sender?.lastName}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                wants to join "{notification.project?.name}"
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log('Accepting notification:', notification._id);
                  console.log('Recipient ID:', notification.recipient); // Log recipient ID
                  console.log('Logged-in User ID:', loggedInUserId); // Log logged-in user ID
                  handleAccept(notification._id, notification.project?._id);
                }}
                style={{ marginTop: '16px' }}
              >
                Accept
              </Button>
            </Box>
          </Box>
          {index !== filteredNotifications.length - 1 && <Divider style={{ margin: '24px 0' }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationMenu;
