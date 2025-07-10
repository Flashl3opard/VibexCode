// app/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Describe whatever you actually store for a user. */
export interface UserData {
  id: string;
  email: string;
  name: string;
  // add more fields as needed
}

/** Slice state */
interface AuthState {
  status: boolean;   // 🔧 primitive type
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
    login: (
      state,
      action: PayloadAction<{ userData: UserData }>
    ) => {
      state.status = true;
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
