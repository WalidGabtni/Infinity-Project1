import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { MoreVert } from "@mui/icons-material"; // Add this import for the MoreVert icon
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Comment from "components/Comment";
import PostForm from 'components/PostForm';
import React from 'react';
import CommentForm from "components/CommentForm";



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
  const [isShareClicked, setIsShareClicked] = useState(false); // New state for tracking share button click
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
   // State variables for confirmation dialog
   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

    // Access user bookmarks from Redux state
    const userBookmarks = useSelector((state) => state.user.bookmarks || []);
  
    const [isBookmarked, setIsBookmarked] = useState(() => {
      // Initialize the bookmark state based on whether postId is in the user's bookmarks
      return userBookmarks.includes(postId);
    });

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

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

  const handleAddComment = async (commentData) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, text: commentData.text }),
      });
      const updatedPost = await response.json();
      setPostComments(updatedPost.comments);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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
  
  const openForm = () => {
    setIsCommentFormOpen(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(false);
  };

  const openConfirmationDialog = () => {
    setIsConfirmationOpen(true);
  };

  // Function to close confirmation dialog
  const closeConfirmationDialog = () => {
    setIsConfirmationOpen(false);
  };

  // Function to handle deletion confirmation
  const handleDeleteConfirmation = () => {
    // Close the confirmation dialog
    closeConfirmationDialog();

    // Call the function to delete the post
    handleDeletePost();
  };

  const handleDeletePost = async () => {
    try {
      const postDeleteResponse = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (postDeleteResponse.ok) {
        console.log('Post deleted successfully');

        const bookmarkDeleteResponse = await fetch(`http://localhost:3001/posts/${postId}/delete-bookmark`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (bookmarkDeleteResponse.ok) {
          console.log('Post removed from bookmark lists successfully');
        } else {
          console.error('Failed to remove post from bookmark lists:', bookmarkDeleteResponse.status, bookmarkDeleteResponse.statusText);
        }

        // Set a flag in localStorage to show the success alert after reload
        localStorage.setItem('showDeleteAlertAfterReload', 'true');
        // Reload the page
        window.location.reload();
      } else {
        console.error('Failed to delete post:', postDeleteResponse.status, postDeleteResponse.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

 

  const handleEditPost = () => {
    handleMenuClose();
    // Set the post data to edit
    setEditPostData({
      title,
      description,
      // Include other post properties as needed
    });

    // Open the edit form
    setIsEditFormOpen(true);
  };

  const handleUpdatePost = async (updatedPostData) => {
    handleMenuClose();
    try {
      // Make a PATCH request to update the post
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPostData),
      });

      if (!response.ok) {
        console.error(`Failed to update post. Server returned ${response.status}: ${response.statusText}`);
        const errorResponse = await response.json();
        console.error('Error details:', errorResponse);
        return;
      }

      // Handle the updated post data as needed
      const updatedPost = await response.json();
      // Dispatch an action or update the local state as needed
      console.log('Post updated successfully:', updatedPost);
      window.location.reload();
    } catch (error) {
      console.error('An unexpected error occurred:', error);
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
        setIsBookmarked(prevState => !prevState);
      } else {
        // Handle the error if the request fails
        const errorMessage = await response.text();
        console.error("Failed to update bookmark:", response.status, errorMessage);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error.message);
    }
  };

  

  return (
    <Box position="relative">
    {/* Move the delete icon inside the container */}
    {loggedInUserId === postUserId && (
        <FlexBetween style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleEditPost}>Edit</MenuItem>
            <MenuItem onClick={openConfirmationDialog}>Delete</MenuItem>
          </Menu>
        </FlexBetween>
      )}
      <Dialog open={isConfirmationOpen} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      
      

      <Typography variant="h2" sx={{ mt: "1rem" }}>
        {title}
      </Typography>

      {/* Format the description using dangerouslySetInnerHTML */}
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

      <Divider/>
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

        {isCommentFormOpen && (
          <CommentForm
            onClose={() => setIsCommentFormOpen(false)}
            onComment={(commentData) => handleAddComment(commentData)} // Adjust the callback function accordingly
          />
        )}
      </FlexBetween>

          
      {isComments && postComments && (
        <Box mt="1rem">
          {postComments.map((comment, i) => (
            <React.Fragment key={`${postId}-${i}`}>
              <Comment
                key={`${postId}-${i}`}
                color={main}
                userPicturePath={comment.userPicturePath}
                userId={comment.userId}
                loggedInUserId={loggedInUserId}
                comment={comment} // Pass the comment text as a prop
                onDelete={() => handleDeleteComment(comment._id)}
                onEdit={(updatedText) => handleEditComment(comment._id, updatedText)}
              />
              
              <Divider /> 
            </React.Fragment>
          ))}
          <Box mt="1rem"/>
          <FlexBetween gap="1.5rem" onClick={() => openForm()}>
            <InputBase
              type="text"
              placeholder="Ajouter un commentaire..."
              sx={{
                width: '100%',
                backgroundColor: palette.neutral.light,
                borderRadius: '2rem',
                padding: '1rem 2rem',
              }} 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </FlexBetween>
        </Box>

      )}
    </WidgetWrapper>
    {isEditFormOpen && (
        <PostForm
          onClose={() => setIsEditFormOpen(false)}
          onPost={(postData) => handleUpdatePost(postData)}  // Use a different handler for updating the post
          postData={editPostData}  // Pass the post data to the PostForm
        />
      )}
    </Box>
  );
};

export default PostWidget;