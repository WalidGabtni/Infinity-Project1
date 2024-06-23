import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Typography, Box } from '@mui/material';
import { DeleteOutlineOutlined as DeleteIcon, EditOutlined as EditIcon, Done as SaveIcon, Close as CancelIcon } from '@mui/icons-material';
import UserImage from './UserImage';
import { useNavigate } from 'react-router-dom';

const Comment = ({ color, onDelete, onEdit, userId, loggedInUserId, comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.text);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(editedText);
  };

  const canEditOrDelete = userId === loggedInUserId;

  const navigateToUserProfile = () => {
    navigate(`/profile/${userId}`);
    
  };

  return (
    <Box display="flex" alignItems="center" mt={1}>
      {/* User's profile picture */}
      {userData && <UserImage image={userData.picturePath} size="40px" />}

      <div style={{ marginLeft: 16 }}>
        {/* User's first name and last name */}
        <Typography
          variant="subtitle1"
          sx={{
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.light',
            },
          }}
          onClick={navigateToUserProfile}
        >
          {userData && `${userData.firstName} ${userData.lastName}`}
        </Typography>

        {/* Display the comment text */}
        <Typography variant="body1" color={color} dangerouslySetInnerHTML={{ __html: comment.text }} />

        {/* Edit and delete buttons  */}
        {canEditOrDelete && (
          <Box mt={1}>
            {!isEditing ? (
              <>
                <IconButton onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={onDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleSaveEdit}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancelEdit}>
                  <CancelIcon />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Comment;
