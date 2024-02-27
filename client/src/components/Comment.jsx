// components/Comment.js

import React, { useState } from 'react';
import { IconButton, Input, Typography, Box } from '@mui/material';
import {
  DeleteOutlineOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  Done as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material';
import UserImage from './UserImage'; // Import the UserImage component

const Comment = ({ text, color, onDelete, onEdit, userPicturePath }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(editedText);
  };

  return (
    <Box display="flex" alignItems="center" mt={1}>
      {userPicturePath && <UserImage image={userPicturePath} />} {/* Check if userPicturePath is defined */}
      {!isEditing ? (
        <>
          <Typography color={color}>{text}</Typography>
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <IconButton onClick={handleSaveEdit}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancelEdit}>
            <CancelIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default Comment;
