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
          <Route path="/projects" element={isAuth ? <ProjectsPage/> : <Navigate to="/" />} />
          <Route path="/projects/:projectId" element={isAuth ? <IndividualProjectPage /> : <Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
      </BrowserRouter>

    </div>
  );
}

export default App;
