import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';

const OneCommentWidget = ({ comment }) => {
    // Log the comment object and its createdBy property
    console.log('Comment:', comment);
    console.log('CreatedBy:', comment?.createdBy);

    // Destructure createdBy from props
    const { createdBy } = comment;

    // Log createdBy
    console.log('CreatedBy:', createdBy);

    // Check if createdBy is available before accessing its properties
    const userName = createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : 'Unknown User';
    const userPicturePath = createdBy ? createdBy.picturePath : '';

    return (
        <WidgetWrapper>
            <Box display="block" marginBottom="16px">
                {createdBy && (
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
