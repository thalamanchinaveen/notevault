import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import CreateNotes from "./Pages/CreateNotes";
import MyNotes from "./Pages/MyNotes";
import UpdateNotes from "./Pages/UpdateNotes";

const NavigationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const validPaths = [
      "/",
      "/register",
      "/login",
      "/profile",
      "/createnotes",
      "/updatenotes/:id",
      "/mynotes",
    ];

    if (!validPaths.some((path) => currentPath.startsWith(path))) {
      navigate("/");
    }
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/createnotes" element={<CreateNotes />} />
          <Route path="/updatenotes/:id" element={<UpdateNotes />} />
          <Route path="/mynotes" element={<MyNotes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* NavigationHandler should be placed inside BrowserRouter */}
      <NavigationHandler />
    </BrowserRouter>
  );
};

export default App;
