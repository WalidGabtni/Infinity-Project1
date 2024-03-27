import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import OneCommentWidget from './OneCommentWidget';

const GetCommentsWidget = ({ projectId, topicId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}/all-comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

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
