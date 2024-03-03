import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { setBookmarkedPosts } from "state";

const PostsWidget = ({userId, isProfile = false, searchResults, isBookmarkPage = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const bookmarks = useSelector((state) => state.user.bookmarks) || [];

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

    // New function to fetch bookmarked posts
    const getBookmarkedPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/bookmarks`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
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

    useEffect(() => {
      if (isProfile) {
        getUserPosts();
      } else if (isBookmarkPage) {
        // Fetch bookmarked posts if it's a bookmark page
        getBookmarkedPosts();
      } else {
        getPosts();
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    // Use searchResults if available and it is an array, otherwise use posts from the state
    let postsToRender;

    if (isBookmarkPage) {
      // Only display bookmarked posts on the bookmark page
      postsToRender = bookmarks.map((bookmarkId) =>
        posts.find((post) => post._id === bookmarkId)
      );
    } else {
      postsToRender = Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : posts;
    }

  return (
    <>
      {Array.isArray(postsToRender) && postsToRender.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          title,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            title={title}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
