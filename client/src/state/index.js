import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  bookmarkedPosts: [],
  projects: [], // Add projects to initialState
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
      state.projects = []; // Reset projects on logout
    },
    setFriends: (state, action) => {
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            friends: action.payload.friends,
          },
        };
      } else {
        console.error("user friends non-existent :(");
        return state; // Return the current state in case the user is non-existent
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
    setProjects: (state, action) => {
      state.projects = action.payload.projects;
    },
    updateProject: (state, action) => {
      const updatedProject = action.payload;
      const index = state.projects.findIndex((project) => project.id === updatedProject.id);

      if (index !== -1) {
        // Replace the existing project with the updated one
        state.projects[index] = updatedProject;
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setBookmarkedPosts,
  setProjects,
  updateProject,
} = authSlice.actions;
export default authSlice.reducer;
