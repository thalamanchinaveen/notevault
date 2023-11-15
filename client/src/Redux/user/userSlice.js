import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.loading = true;
    },
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    logInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getUserDetailsStart: (state) => {
      state.loading = true;
    },
    getUserDetailsSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    getUserDetailsFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserDetailsStart: (state) => {
      state.loading = true;
    },
    updateUserDetailsSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserDetailsFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserDetailsStart: (state) => {
      state.loading = true;
    },
    deleteUserDetailsSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserDetailsFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  logInStart,
  logInSuccess,
  logInFailure,
  getUserDetailsStart,
  getUserDetailsSuccess,
  getUserDetailsFail,
  updateUserDetailsStart,
  updateUserDetailsSuccess,
  updateUserDetailsFail,
  deleteUserDetailsStart,
  deleteUserDetailsSuccess,
  deleteUserDetailsFail,
} = userSlice.actions;

export default userSlice.reducer;
