import React, { useMemo } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from 'theme';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import BookmarkPage from 'scenes/bookmarks';
import ProjectsPage from 'scenes/projectsPage';
import IndividualProjectPage from 'scenes/projectsPage/IndividualProjectPage';
import PublicTopicsPage from 'scenes/projectsPage/PublicTopicsPage';
import PrivateTopicsPage from 'scenes/projectsPage/PrivateTopicsPage';
import MembersPage from 'scenes/projectsPage/MembersPage';
import MembersManagementPage from 'scenes/projectsPage/MembersManagementPage'; // Import MembersManagementPage
import ArchivePage from 'scenes/projectsPage/ArchivePage';
import PublicTopicDetailsPage from 'scenes/projectsPage/PublicTopicDetailsPage';
import PrivateTopicDetailsPage from 'scenes/projectsPage/PrivateTopicDetailsPage';

function App() {
  const mode = useSelector((state) => state.mode);
  const isAuth = useSelector((state) => Boolean(state.token));
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/bookmarks" element={isAuth ? <BookmarkPage /> : <Navigate to="/" />} />
            <Route path="/projects/*" element={isAuth ? <ProjectsPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId" element={isAuth ? <IndividualProjectPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/public-topics" element={isAuth ? <PublicTopicsPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/private-topics" element={isAuth ? <PrivateTopicsPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/members" element={isAuth ? <MembersPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/members-management" element={isAuth ? <MembersManagementPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/archive" element={isAuth ? <ArchivePage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/public-topics/:topicId" element={isAuth ? <PublicTopicDetailsPage /> : <Navigate to="/" />} />
            <Route path="/projects/:projectId/private-topics/:topicId" element={isAuth ? <PrivateTopicDetailsPage /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
