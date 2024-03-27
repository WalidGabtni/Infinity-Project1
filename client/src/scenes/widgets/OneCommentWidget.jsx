import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useSelector } from 'react-redux';

const OneCommentWidget = ({ comment }) => {
    const loggedInUser = useSelector((state) => state.user);

    return (
        <WidgetWrapper>
            <Box display="block" marginBottom="16px">
            <Typography variant="body1">{loggedInUser.firstName} {loggedInUser.lastName}</Typography>
                <Box display="flex" alignItems="center" gap="16px">
                    <Avatar sx={{ width: 70, height: 70 }}> 
                        <UserImage image={loggedInUser.picturePath} size="70px" />
                    </Avatar>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comment.comment }} />
                </Box>
            </Box>
        </WidgetWrapper>
    );
};

export default OneCommentWidget;
