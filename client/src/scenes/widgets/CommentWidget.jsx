import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, TextField } from '@mui/material';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CommentWidget = ({ projectId, topicId, topicDetails, isPrivate }) => {
  const [comment, setComment] = useState('');
  const [isQuillEnabled, setIsQuillEnabled] = useState(false);
  const loggedInUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/${isPrivate ? 'private' : 'public'}/${topicId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topicId: topicDetails._id,
          comment: comment,
          userId: loggedInUser._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setComment('');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-between" gap="16px">
        <Avatar>
          <UserImage image={loggedInUser.picturePath} size="40px" />
        </Avatar>

        {isQuillEnabled ? (
          <div style={{ maxWidth: '100%', width: '100%' }}>
            <ReactQuill
              value={comment}
              onChange={handleCommentChange}
              theme="snow"
              placeholder="Write a comment..."
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  ['link', 'image'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ]
              }}
            />
          </div>
        ) : (
          <TextField
            id="comment"
            label="Write a comment"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(event) => handleCommentChange(event.target.value)}
            onClick={() => setIsQuillEnabled(true)}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          disabled={!comment}
          style={{ alignSelf: 'center', minWidth: '100px' }}
        >
          Submit
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default CommentWidget;
