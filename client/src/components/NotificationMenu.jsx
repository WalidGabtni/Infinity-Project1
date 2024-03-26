import React from 'react';
import { Typography, Avatar, Box, Button, Divider, Snackbar } from '@mui/material';
import UserImage from './UserImage'; // Import the UserImage component

const NotificationMenu = ({ notifications, handleAccept, handleRefuse, loggedInUserId, rejectedNotificationId }) => {
  // Filter out notifications with status "accepted" and "rejected" and only display notifications for the current user
  const filteredNotifications = notifications.filter(notification => {
    if (notification.status === 'rejected') {
      return notification.sender._id === loggedInUserId || notification.recipient === loggedInUserId;
    }
    return notification.status === 'accepted' || notification.status === 'pending' && (notification.sender._id === loggedInUserId || notification.recipient === loggedInUserId);
  });

  if (!filteredNotifications || filteredNotifications.length === 0) {
    return <Typography>No notifications</Typography>;
  }

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
              {notification.status === 'pending' && (
                <React.Fragment>
                  <Typography variant="body1" color="textSecondary">
                    wants to join "{notification.project?.name}"
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {getTimeElapsed(notification.createdAt)} {/* Display time elapsed */}
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccept(notification._id, notification.project?._id)}
                      style={{ marginRight: '8px', marginTop: '16px' }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRefuse(notification._id, notification.project?._id)}
                      style={{ marginTop: '16px' }}
                    >
                      Refuse
                    </Button>
                  </Box>
                </React.Fragment>
              )}
              {notification.status === 'rejected' && (
                <Typography variant="body1" color="textSecondary">
                  Your join request for "{notification.project?.name}" has been rejected.
                </Typography>
              )}
              {notification.status === 'accepted' && (
                <Typography variant="body1" color="textSecondary">
                  Your join request for "{notification.project?.name}" has been accepted.
                </Typography>
              )}
              {rejectedNotificationId === notification._id && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => {}}>
                  <Typography>Join request has been rejected.</Typography>
                </Snackbar>
              )}
            </Box>
          </Box>
          {index !== filteredNotifications.length - 1 && <Divider style={{ margin: '24px 0' }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationMenu;
