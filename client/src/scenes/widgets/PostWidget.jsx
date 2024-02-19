import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Input, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Comment from "components/Comment";
import React from 'react';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments = [] // Initialize comments as an empty array
}) => {

  /*COMENTS STATES*/
  const [isComments, setIsComments] = useState(false);
  const [postComments, setPostComments] = useState(comments);
  const [newComment, setNewComment] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleAddComment = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, text: newComment }), // Include userId in the request body
    });
    const updatedPost = await response.json();
    setPostComments(updatedPost.comments);
    setNewComment("");
  };
  
  const handleDeleteComment = async (index) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete comment response:", response);

      // If the deletion was successful, update the local state
      const updatedPost = await response.json();
      console.log("Updated post after delete:", updatedPost);

      setPostComments((prevComments) => {
        const newComments = [...prevComments];
        newComments.splice(index, 1);
        return newComments;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
 };
  

 const handleEditComment = async (index, updatedText) => {
  try {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${index}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: updatedText }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.status} - ${response.statusText}`);
    }

    const updatedPost = await response.json();

    // Ensure the server response contains the expected structure
    if (updatedPost && updatedPost.comments) {
      setPostComments(updatedPost.comments);
    } else {
      console.error("Unexpected server response:", updatedPost);
    }
  } catch (error) {
    console.error("Error updating comment:", error.message);
  }
};

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{postComments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

              {isComments && postComments && (
          <Box mt="1rem">
            {console.log("postComments:", postComments)} {/* Add this line for debugging */}
                        {postComments.map((comment, i) => (
              <React.Fragment key={`${postId}-${i}`}>
                <Comment
                  key={`${postId}-${i}`}
                  text={comment.text}
                  color={main}
                  onDelete={() => handleDeleteComment(i)}
                  onEdit={(updatedText) => handleEditComment(i, updatedText)}
                />
                <Divider />
              </React.Fragment>
            ))}

            <Input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {newComment && (
              <button onClick={handleAddComment}>Ajouter un commentaire</button>
            )}
          </Box>
        )}

    </WidgetWrapper>
  );
};

export default PostWidget;
