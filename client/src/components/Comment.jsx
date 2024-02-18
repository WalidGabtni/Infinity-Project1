// components/Comment.js

import React, { useState } from 'react';
import { IconButton, Input, Typography } from '@mui/material';
import {
  DeleteOutlineOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  Done as SaveIcon, // Replace with the appropriate icon
  Close as CancelIcon, // Replace with the appropriate icon
} from '@mui/icons-material';

const Comment = ({ text, color, onDelete, onEdit }) => {
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
    <div>
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
    </div>
  );
};

export default Comment;
