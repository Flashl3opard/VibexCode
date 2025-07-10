// app/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

//Defining the type for user data
interface UserData {
    email: string;
    name: string;
}

/** Slice state */
interface AuthState {
    status: boolean,
    userData: UserData | null,
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ status: boolean ; userData: UserData | null }>) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state)=>{
            state.status = false;
            state.userData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
