import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  bookmarkedPosts: [],
  projects: [],
  members: [],
  description: '',
  notifications: [], // Add notifications to initialState
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
      state.projects = [];
      state.notifications = []; // Reset notifications on logout
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
        return state;
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
        state.projects[index] = updatedProject;
      }
    },
    setMembers: (state, action) => {
      state.members = action.payload.members;
    },
    setDescription: (state, action) => {
      state.description = action.payload.description;
    },
    joinProject: (state, action) => {
      const { projectId, user } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === projectId);
      
      if (projectIndex !== -1) {
        state.projects[projectIndex].members.push(user);
      }
    },
    setNotifications: (state, action) => {
      const { userId, notifications } = action.payload;
      // Initialize state.notifications as an array if it's not already
      if (!state.notifications) {
        state.notifications = [];
      }
      // Find the user in the notifications array or create a new entry if not found
      const userNotifications = state.notifications.find(entry => entry.userId === userId);
      if (userNotifications) {
        // If user notifications exist, update them
        userNotifications.notifications = notifications;
      } else {
        // If user notifications don't exist, create a new entry
        state.notifications.push({ userId, notifications });
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
  setMembers,
  setDescription,
  joinProject,
  setNotifications, // Export the new action
} = authSlice.actions;
export default authSlice.reducer;