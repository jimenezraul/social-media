import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface UserState {
    user: object | null;
    status: 'idle' | 'loading' | 'failed';
    token: object | null;
    isLoggedIn: boolean;
}

export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
        status: 'idle',
        token: null,
        isLoggedIn: localStorage.getItem('user') ? true : false,
    } as UserState,
    reducers: {
        login: (state, action: PayloadAction<object>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        user_logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        setToken: (state, action: PayloadAction<object>) => {
            state.token = action.payload;
        },
        setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
            state.status = action.payload;
        },
    },
});
export const { login, user_logout } = UserSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default UserSlice.reducer;