import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import PostsWidget from "scenes/widgets/PostsWidget"; // Update the import
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useEffect } from "react";
import { setBookmarkedPosts } from "state";

const BookmarkPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const bookmarkedPosts = useSelector((state) => state.user.bookmarkedPosts) || [];
  const dispatch = useDispatch();

  // Fetch bookmarked posts on component mount
  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      console.log("User ID:", _id);
      try {
        // Check if _id is defined before making the request
        if (!_id) {
          return;
        }
  
        const response = await fetch(`http://localhost:3001/api/users/${_id}/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        dispatch(setBookmarkedPosts({ bookmarkedPosts: data }));
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error.message);
      }
    };
  
    fetchBookmarkedPosts();
  }, [_id, token, dispatch]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* Pass bookmarked posts to PostsWidget and set isBookmarkPage to true */}
          <PostsWidget isBookmarkPage={true} />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <AdvertWidget />
          <Box m="2rem 0" />
          <FriendListWidget userId={_id} />
        </Box>
      </Box>
    </Box>
  );
};

export default BookmarkPage;