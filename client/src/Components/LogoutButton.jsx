// LogoutButton.js
import React from "react";
import { useDispatch } from "react-redux";
import { deleteUserDetailsFail, deleteUserDetailsStart, deleteUserDetailsSuccess } from "../Redux/user/userSlice";
import axios from "axios";
import { persistor } from "../Redux/store";
import { Navigate } from "react-router-dom";

const LogoutButton = ({ className }) => {
  const dispatch = useDispatch();
  

  const logoutHandler = async () => {
    try {
      dispatch(deleteUserDetailsStart());
      await axios.get("http://localhost:8000/api/auth/logout");
      dispatch(deleteUserDetailsSuccess());
      <Navigate to="/login"/>
      persistor.purge();
    } catch (err) {
      dispatch(deleteUserDetailsFail(err.response.data.message));
    }
  };

  return (
    <button onClick={logoutHandler} className={className}>
      Logout
    </button>
  );
};

export default LogoutButton;
