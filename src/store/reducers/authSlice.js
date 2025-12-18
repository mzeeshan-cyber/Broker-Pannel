// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  token:null,
  loginVerificationCode:null,
  resetPasswordVerificationCode:null,
  forgotEmail:null,
  codeTime:0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    token: (state, action) => {
      state.token = action.payload;
    },
    loginVerificationCode: (state, action) => {
      state.loginVerificationCode = action.payload;
    },
    resetPasswordVerificationCode: (state, action) => {
      state.resetPasswordVerificationCode = action.payload;
    },
    forgotEmail: (state, action) => {
      state.forgotEmail = action.payload;
    },
    codeTimer: (state, action) => {
      state.codeTime = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loginVerificationCode = null;
      state.user = null;
      state.error = null;
    },
  },
});

export const { loginSuccess,token,loginVerificationCode, resetPasswordVerificationCode, forgotEmail, codeTimer, logout } = authSlice.actions;

export default authSlice.reducer;
