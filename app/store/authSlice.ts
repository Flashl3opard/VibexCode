// File: /app/store/authSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  email: string;
  name: string;
}

interface AuthState {
  status: boolean;
  userData: UserData | null;
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ status: boolean; userData: UserData | null }>) => {
      state.status = action.payload.status;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
