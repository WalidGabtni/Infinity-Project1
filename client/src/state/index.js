import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  bookmarkedPosts: [], // Add bookmarkedPosts to initialState
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.bookmarkedPosts = user ? user.bookmarks : [];
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.bookmarkedPosts = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setBookmarkedPosts: (state, action) => {
      state.bookmarkedPosts = action.payload.bookmarkedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setBookmarkedPosts } =
  authSlice.actions;
export default authSlice.reducer;
