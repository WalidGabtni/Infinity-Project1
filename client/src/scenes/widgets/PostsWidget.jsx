import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setBookmarkedPosts } from "state"; // Update import path
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false, searchResults, isBookmarkPage = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const bookmarkedPosts = useSelector((state) => state.bookmarkedPosts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

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
      // Fetch user-specific posts
      // Example: getUserPosts();
    } else if (isBookmarkPage) {
      // Fetch bookmarked posts
      getBookmarkedPosts();
    } else {
      // Fetch all posts
      getPosts();
    }
  }, [userId, token, isProfile, isBookmarkPage, dispatch]);

  const postsToRender = isBookmarkPage
    ? posts.filter((post) => bookmarkedPosts.includes(post._id))
    : Array.isArray(searchResults) && searchResults.length > 0
    ? searchResults
    : posts;

  return (
    <>
      {postsToRender.map(({
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
      ))}
    </>
  );
};

export default PostsWidget;
