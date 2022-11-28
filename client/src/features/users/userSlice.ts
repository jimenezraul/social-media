import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface UserState {
  _id: string | null;
  user: {
    _id?: string;
    given_name?: string;
    family_name?: string;
    isAdmin?: boolean;
    isVerified?: boolean;
    profileUrl?: string;
  };
  access_token: String | null;
  isLoggedIn: boolean;
  notifications: [] | object[];
  me: User | undefined
}

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {},
    access_token: localStorage.getItem('access_token')
      ? localStorage.getItem('access_token') || ''
      : null,
    isLoggedIn: localStorage.getItem('user') ? true : false,
    notifications: localStorage.getItem('notifications')
      ? JSON.parse(localStorage.getItem('notifications') || '[]')
      : [],
  } as UserState,
  reducers: {
    user_login: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    user_logout: (state) => {
      state.user = {};
      state.access_token = null;
      state.isLoggedIn = false;
    },
    setAccessToken: (state, action: PayloadAction<String>) => {
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
