import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TopicDetailsWidget = ({ }) => {
    const { projectId, topicId } = useParams();
    const [topicDetails, setTopicDetails] = useState(null);
    const [createdAt, setCreatedAt] = useState(null); // State variable to hold the creation date

    useEffect(() => {
        const fetchTopicDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch topic details');
                }

                const data = await response.json();
                setTopicDetails(data); // Update state with the fetched topic details
                setCreatedAt(data.createdAt); // Update state with the creation date

            } catch (error) {
                console.error('Error fetching topic details:', error);
            }
        };

        fetchTopicDetails();
    }, [projectId, topicId]);

    return (
        <WidgetWrapper style={{ padding: '2rem', borderRadius: '0px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            {topicDetails && (
                <Box>
                    {/* Display name and creation date */}
                    <Box display="flex" alignItems="center">
                        {/* Use Link to navigate to user profile on name click */}
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            <Link to={`/profile/${topicDetails.createdBy.userId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                                {topicDetails.createdBy.firstName} {topicDetails.createdBy.lastName}
                            </Link>
                        </Typography>
                        {/* Display the creation date */}
                        <Typography variant="body2" sx={{ ml: 10, mt: 1 }}>
                            Topic Created on {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : ''}
                        </Typography>
                    </Box>
                    <Box m="1rem 0" />
                    {/* Display UserImage */}
                    <Box display="flex" alignItems="center">
                        {/* Use Link to navigate to user profile on image click */}
                        <Link to={`/profile/${topicDetails.createdBy.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <UserImage image={topicDetails.createdBy.picturePath} size="100px" sx={{ cursor: 'pointer' }} />
                        </Link>
                    </Box>
                    <Box m="5rem 0" />
                    {/* Display topic content */}
                    <Typography variant="body1" sx={{ color: 'neutral.main', ml: 22, mt: 2 }} dangerouslySetInnerHTML={{ __html: topicDetails.content }} />
                    <Divider sx={{ color: 'neutral.main', ml: 22}}/>
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default TopicDetailsWidget;
