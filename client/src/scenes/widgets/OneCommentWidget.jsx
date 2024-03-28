import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useSelector } from 'react-redux';

const OneCommentWidget = ({ comment }) => {
    // Log the comment object and its createdBy property
    console.log('Comment:', comment);
    console.log('CreatedBy:', comment?.createdBy);

    // Retrieve user information of the user who wrote the comment from Redux store
    const users = useSelector(state => state.users);
    
    // Extract userId from createdBy, if available
    const userId = comment?.createdBy?.userId;
    
    // Find user based on userId
    const createdByUser = userId ? users[userId] : null;

    // Check if createdByUser is available before accessing its properties
    const userName = createdByUser ? `${createdByUser.firstName} ${createdByUser.lastName}` : 'Unknown User';
    const userPicturePath = createdByUser ? createdByUser.picturePath : '';

    return (
        <WidgetWrapper>
            <Box display="block" marginBottom="16px">
                {createdByUser && (
                    <>
                        <Typography variant="body1">{userName}</Typography>
                        <Box display="flex" alignItems="center" gap="16px">
                            <Avatar sx={{ width: 70, height: 70 }}>
                                <UserImage image={userPicturePath} size="70px" />
                            </Avatar>
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comment?.comment }} />
                        </Box>
                    </>
                )}
            </Box>
        </WidgetWrapper>
    );
};

export default OneCommentWidget;
