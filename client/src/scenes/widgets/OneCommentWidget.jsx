import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';

const OneCommentWidget = ({ comment }) => {
    // Destructure createdBy from props
    const { createdBy } = comment;

    // Check if createdBy is available before accessing its properties
    const userName = createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : 'Unknown User';
    const userPicturePath = createdBy ? createdBy.picturePath : '';

    return (
        <WidgetWrapper style={{ padding: '2rem', borderRadius: '0px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Box display="block" marginBottom="15px">
                    {createdBy && (
                        <Box display="flex" flexDirection="column" alignItems="left">
                            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>{userName}</Typography>
                            <Avatar sx={{ width: 90, height: 90, marginLeft: '1rem', marginTop: '1rem' }}>
                                <UserImage image={userPicturePath} size="90px" />
                            </Avatar>
                            <Box display="flex" flexDirection="column" marginLeft="flex-end" sx={{ marginTop: '-5rem', marginBottom: '50px' }}>
                                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comment?.comment }} style={{ textAlign: 'left', marginLeft: '11rem'}} />
                            </Box>
                        </Box>
                    )}
                </Box>

        </WidgetWrapper>
    );
};

export default OneCommentWidget;
