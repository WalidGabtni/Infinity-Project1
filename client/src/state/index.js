// Redux authSlice.js

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
  notifications: [],
  publicTopics: [], // Add publicTopics to initialState
  currentTopic: null,
  commenterDetails: null,
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
      state.notifications = [];
      state.publicTopics = []; // Reset publicTopics on logout
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          friends: action.payload.friends,
        };
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
      if (!state.notifications) {
        state.notifications = [];
      }
      const userNotifications = state.notifications.find(entry => entry.userId === userId);
      if (userNotifications) {
        userNotifications.notifications = notifications;
      } else {
        state.notifications.push({ userId, notifications });
      }
      state.notifications = state.notifications.filter(entry => entry.notifications.some(notification => notification._id !== userId));
    },
    leaveProject: (state, action) => {
      const { projectId, userId } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === projectId);
      
      if (projectIndex !== -1) {
        state.projects[projectIndex].members = state.projects[projectIndex].members.filter(member => member.userId !== userId);
      }
    },
    setPublicTopics: (state, action) => {
      state.publicTopics = action.payload;
    },
    setPublicTopicDetails: (state, action) => {
      state.currentTopic = action.payload; // Set the details of the currently selected public topic
    },
    setCommenterDetails: (state, action) => {
      state.commenterDetails = action.payload;
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
  setNotifications,
  leaveProject,
  setPublicTopics,
  setPublicTopicDetails,
  setCommenterDetails,
} = authSlice.actions;

export default authSlice.reducer;
