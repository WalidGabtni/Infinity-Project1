import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import OneCommentWidget from './OneCommentWidget';

const GetCommentsWidget = ({ projectId, topicId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for projectId: ${projectId}, topicId: ${topicId}`);
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}/all-comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
  
        const commentsData = await response.json();
        console.log('Fetched comments:');
        commentsData.forEach(comment => {
          const { _id, comment: commentText, createdBy } = comment;
          console.log(`Comment Id: ${_id}`);
          console.log(`Comment Text: ${commentText}`);
          console.log(`User Id: ${createdBy?._id}`);
          console.log(`User Name: ${createdBy?.firstName} ${createdBy?.lastName}`);
          console.log(`User Picture: ${createdBy?.picturePath}`);
        });
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    console.log('Fetching comments...');
    fetchComments();
  }, [projectId, topicId]);

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {comments.map((comment, index) => (
        <OneCommentWidget key={index} comment={comment} />
      ))}
    </Box>
  );
};

export default GetCommentsWidget;
