import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { Box } from "@mui/material"; // Import Box from MUI

const Bookmark = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getBookmarkedPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/bookmarks/posts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          dispatch(setPosts({ posts: result })); // Update Redux state with bookmarked posts
        } else {
          console.error('Failed to fetch bookmarked posts:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
      }
    };

    getBookmarkedPosts();
  }, [token, dispatch]);

  return (
    <div>
      <Navbar updateSearchResults={() => {}} />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        flexDirection="column" // Updated to column layout
      >
        <Box>
          <UserWidget /> {/* Place UserWidget here */}
        </Box>
        <Box style={{ flexDirection: "row" }} display="flex" gap="0.5rem" mt="1rem">
          <Box flexBasis="42%">
            <MyPostWidget searchResults={bookmarks} /> {/* Pass bookmarks as searchResults */}
            <PostsWidget searchResults={bookmarks} /> {/* Pass bookmarks as searchResults */}
          </Box>
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget /> {/* Assuming FriendListWidget automatically fetches data based on the logged-in user */}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Bookmark;
