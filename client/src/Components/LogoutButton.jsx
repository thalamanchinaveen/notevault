// LogoutButton.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteUserDetailsFail,
  deleteUserDetailsStart,
  deleteUserDetailsSuccess,
} from "../Redux/user/userSlice";
import { persistor } from "../Redux/store";
import { Navigate } from "react-router-dom";
import Popup from "./Popup";
import api from "./api";

const LogoutButton = ({ className }) => {
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      return <Navigate to="/login" />;
    }
  }, [shouldRedirect]);

  const logoutHandler = async () => {
    setLogoutLoading(true);
    try {
      dispatch(deleteUserDetailsStart());
      await api.get(`/api/auth/logout`);
      dispatch(deleteUserDetailsSuccess());
      setLogoutLoading(false);
      setShouldRedirect(true);
      persistor.purge();
    } catch (err) {
      dispatch(
        deleteUserDetailsFail(err.response?.data?.message || "Unknown error")
      );
      setLogoutLoading(false);
    }
  };

  return logoutLoading ? (
    <Popup text={"Logging Out"} />
  ) : (
    <button onClick={logoutHandler} className={className}>
      Logout
    </button>
  );
};

export default LogoutButton;
