import React, { useState } from 'react';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Input, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Comment from "components/Comment";

const PostWidget = ({
  postId,
  postUserId,
  name,
  title,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments = [] // Initialize comments as an empty array
}) => {
  const [isComments, setIsComments] = useState(false);
  const [postComments, setPostComments] = useState(comments);
  const [newComment, setNewComment] = useState("");
  
  // Access user bookmarks from Redux state
  const userBookmarks = useSelector((state) => state.user.bookmarks || []);
  
  const [isBookmarked, setIsBookmarked] = useState(() => {
    // Initialize the bookmark state based on whether postId is in the user's bookmarks
    return userBookmarks.includes(postId);
  });

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
      body: JSON.stringify({ userId: loggedInUserId, text: newComment }),
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

      const updatedPost = await response.json();

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

      if (updatedPost && updatedPost.comments) {
        setPostComments(updatedPost.comments);
      } else {
        console.error("Unexpected server response:", updatedPost);
      }
    } catch (error) {
      console.error("Error updating comment:", error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      // Make a request to delete the post
      const postDeleteResponse = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (postDeleteResponse.ok) {
        console.log('Post deleted successfully');
        
        // Make a separate request to remove the post from the bookmark lists of all users
        const bookmarkDeleteResponse = await fetch(`http://localhost:3001/posts/${postId}/delete-bookmark`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (bookmarkDeleteResponse.ok) {
          console.log('Post removed from bookmark lists successfully');
          // Perform any additional actions after successful deletion
          // For example, redirect to a different page or update the state.
        } else {
          console.error('Failed to remove post from bookmark lists:', bookmarkDeleteResponse.status, bookmarkDeleteResponse.statusText);
        }
      } else {
        console.error('Failed to delete post:', postDeleteResponse.status, postDeleteResponse.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  const handleBookmark = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${loggedInUserId}/bookmarks/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Toggle the bookmark state
        const newIsBookmarked = !isBookmarked;
        setIsBookmarked(newIsBookmarked);

        // Remove the localStorage logic for debugging purposes
        // localStorage.setItem(`bookmark_${postId}`, JSON.stringify(newIsBookmarked));
      } else {
        console.error("Failed to update bookmark:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error.message);
    }
  };
  

  return (
    <WidgetWrapper m="2rem 0" position="relative">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      
      <Typography variant="h2" sx={{ mt: "1rem" }}>
        {title}
      </Typography>

      <Typography color={main} sx={{ mt: "1rem" }} dangerouslySetInnerHTML={{ __html: description }} />
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
          
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleBookmark}>
              {isBookmarked ? <Bookmark sx={{ color: primary }} /> : <BookmarkBorder />}
            </IconButton>
            {/* You can display the count of bookmarks here if needed */}
          </FlexBetween>
        </FlexBetween>

        {loggedInUserId === postUserId && (
          <IconButton
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            onClick={handleDeletePost}
          >
            <DeleteOutline />
          </IconButton>
        )}
      </FlexBetween>

      {isComments && postComments && (
        <Box mt="1rem">
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
            placeholder="Ajouter un commentaire..."
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
