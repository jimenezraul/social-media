import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserState {
  _id: string | null;
  user: object | null;
  access_token: object | null;
  isLoggedIn: boolean;
  notifications: [] | object[];
}

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null,
    access_token: localStorage.getItem("access_token")
      ? localStorage.getItem("access_token") || "{}"
      : null,
    isLoggedIn: localStorage.getItem("user") ? true : false,
    notifications: localStorage.getItem("notifications") ? JSON.parse(localStorage.getItem("notifications") || "[]") : [],
  } as UserState,
  reducers: {
    user_login: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    user_logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isLoggedIn = false;
    },
    setAccessToken: (state, action: PayloadAction<object>) => {
      state.access_token = action.payload;
    },
    setNotifications: (state, action: PayloadAction<object[]>) => {
        state.notifications = action.payload;
        }
        
  },
});
export const { user_login, user_logout, setAccessToken, setNotifications } = UserSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const notifications = (state: RootState) => state.user.notifications;

export default UserSlice.reducer;
