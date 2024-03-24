import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import BookmarkPage from 'scenes/bookmarks';
import ProjectsPage from 'scenes/projectsPage';
import { useMemo } from "react";
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from 'theme';
import IndividualProjectPage from 'scenes/projectsPage/IndividualProjectPage';
import PublicTopicsPage from 'scenes/projectsPage/PublicTopicsPage';
import PrivateTopicsPage from 'scenes/projectsPage/PrivateTopicsPage'; // Add PrivateTopicsPage import
import MembersPage from 'scenes/projectsPage/MembersPage'; // Add MembersPage import
import ArchivePage from 'scenes/projectsPage/ArchivePage'; // Add ArchivePage import
import PublicTopicDetailsPage from 'scenes/projectsPage/PublicTopicDetailsPage';




function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(()=> createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />}/>
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/bookmarks" element={isAuth ? <BookmarkPage /> : <Navigate to="/" />} />
          <Route path="/projects/*" element={isAuth ? <ProjectsPage/> : <Navigate to="/" />} />
          <Route path="/projects/:projectId" element={isAuth ? <IndividualProjectPage /> : <Navigate to="/" />} />
          <Route path="/projects/:projectId/public-topics" element={isAuth ? <PublicTopicsPage /> : <Navigate to="/" />} />
          <Route path="/projects/:projectId/private-topics" element={isAuth ? <PrivateTopicsPage /> : <Navigate to="/" />} /> 
          <Route path="/projects/:projectId/members" element={isAuth ? <MembersPage /> : <Navigate to="/" />} /> 
          <Route path="/projects/:projectId/archive" element={isAuth ? <ArchivePage /> : <Navigate to="/" />} /> 
          <Route path="/projects/:projectId/public-topics/:topicId" element={isAuth ? <PublicTopicDetailsPage /> : <Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
      </BrowserRouter>

    </div>
  );
}

export default App;
