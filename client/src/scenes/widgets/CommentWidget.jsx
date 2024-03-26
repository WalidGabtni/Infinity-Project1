import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, TextField } from '@mui/material';
import UserImage from 'components/UserImage'; // Import the UserImage component
import WidgetWrapper from 'components/WidgetWrapper';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const CommentWidget = ({ topicDetails, projectId, topicId }) => {
  const [comment, setComment] = useState('');
  const [isQuillEnabled, setIsQuillEnabled] = useState(false); // State to track whether Quill is enabled
  const loggedInUser = useSelector((state) => state.user);

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleCommentSubmit = async () => {
    try {
      console.log('Submitting comment...');
      
      // Check if topicDetails is available
      if (!topicDetails) {
        console.error('Error: Topic details not found');
        return;
      }

      // Check if loggedInUser is available
      if (!loggedInUser) {
        console.error('Error: User not logged in');
        return;
      }

      // Make the API request to submit the comment
      console.log('Topic ID:', topicDetails._id);
      console.log('User ID:', loggedInUser._id);
      console.log('Comment:', comment);
  
      // Make the API request to submit the comment
      const response = await fetch(`http://localhost:3001/projects/${projectId}/topics/public/${topicId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topicDetails._id,
          content: comment,
          userId: loggedInUser._id,
        }),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
  
      // Clear the comment field after submitting
      setComment('');
  
      // Optionally, you can fetch the updated topic details or update the UI in some way
      // For example:
      // const updatedTopicDetails = await response.json();
      // Update the UI with the new comment
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle error, e.g., display an error message to the user
    }
  };


  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-between"  gap="16px">
        {/* Logged-in User Image */}
        <Avatar>
          {/* Render the user image */}
          <UserImage image={loggedInUser.picturePath} size="40px" />
        </Avatar>

        {/* Comment Input (TextField or ReactQuill) */}
        {isQuillEnabled ? (
        // Render ReactQuill if isQuillEnabled is true
            <div style={{ maxWidth: '100%', width: '100%' }}> {/* Limit width to prevent overlap */}
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
                    [{ 'color': [] }, { 'background': [] }], // Add color and background options
                    ['clean']
                    ]
                }}
            />
        </div>
    ) : (
          // Render TextField by default
          <TextField
            id="comment"
            label="Write a comment"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(event) => handleCommentChange(event.target.value)}
            onClick={() => setIsQuillEnabled(true)} // Enable Quill when TextField is clicked
          />
        )}

        {/* Submit Button */}
        <Button
            variant="contained"
            color="primary"
            onClick={() => handleCommentSubmit(projectId, topicId)}
            disabled={!comment} // Disable button if comment is empty
            style={{ alignSelf: 'center', minWidth: '100px' }} // Center the button and set minimum width
        >
            Submit
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default CommentWidget;
