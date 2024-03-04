import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

   // Add state for search results
   const [searchResults, setSearchResults] = useState([]);

   // Function to update search results
   const updateSearchResults = (results) => {
     setSearchResults(results);
   };
 
  return (
    <Box>
      <Navbar updateSearchResults={updateSearchResults} />
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
           {/* Pass search results to MyPostWidget */}
           <MyPostWidget picturePath={picturePath} searchResults={searchResults} />
          
          {/* Pass search results to PostsWidget */}
          <PostsWidget userId={_id} searchResults={searchResults} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;