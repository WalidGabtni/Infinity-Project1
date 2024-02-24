// Import MUI icons
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
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

  const [isComments, setIsComments] = useState(false);
  const [postComments, setPostComments] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [isShareClicked, setIsShareClicked] = useState(false); // New state for tracking share button click
  const [isShareHovered, setIsShareHovered] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const handleShareHover = () => {
    // Set the hover state to true when the share button is hovered
    setIsShareHovered(true);
  };

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

  const handleShare = async () => {
    try {
      const shareUrl = encodeURIComponent(`https://localhost:3001/posts/${postId}`);
  
      // Open share dialog using Facebook's Share Dialog method
      window.FB.ui({
        method: 'share',
        href: shareUrl,
      }, (response) => {
        console.log('Facebook Share Response:', response);
  
        if (response && !response.error_message) {
          console.log('Post shared successfully on Facebook');
          // Set state to indicate that the share button is clicked
          setIsShareClicked(true);
        } else if (response && response.error_message) {
          console.error('Error sharing post on Facebook:', response.error_message);
        } else {
          console.error('Error sharing post on Facebook: Undefined response');
        }
      });
    } catch (error) {
      console.error('Error sharing post:', error.message);
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
          <IconButton
            onClick={() => setIsComments(!isComments)}
          >
            <ChatBubbleOutlineOutlined />
          </IconButton>
          <Typography>{postComments.length}</Typography>
        </FlexBetween>
      </FlexBetween>

      <FlexBetween gap="0.3rem" style={{ position: 'relative' }}>
  <div
    onMouseEnter={handleShareHover}
    onMouseLeave={() => {
      if (!isShareClicked) {
        setIsShareHovered(false);
      }
    }}
    onClick={() => setIsShareClicked(!isShareClicked)}
    style={{ display: 'inline-block' }}
  >
    <IconButton>
      <ShareOutlined />
    </IconButton>
  </div>

  {isShareHovered && (isShareClicked || isShareHovered) && (
    <Box
      display="flex"
      alignItems="center"
      position="absolute"
      top="-6px"
      left="-8rem"
      onMouseEnter={handleShareHover}
      onMouseLeave={() => {
        // Set the hover state to false only if the share button is not clicked
        if (!isShareClicked) {
          setIsShareHovered(false);
        }
      }}
    >
      <IconButton onClick={handleShare} style={{ margin: '5px' }}>
        <FacebookIcon style={{ color: '#1877f2' }} />
      </IconButton>

      <IconButton style={{ margin: '5px' }}>
        <InstagramIcon style={{ color: '#e4405f' }} />
      </IconButton>
      
      <IconButton style={{ margin: '5px' }}>
        <TwitterIcon style={{ color: '#1da1f2' }} />
      </IconButton>
    </Box>
  )}
</FlexBetween>


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
