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
        user: null,
        status: 'idle',
        token: null,
        isLoggedIn: false,
    } as UserState,
    reducers: {
        login: (state, action: PayloadAction<object>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        setToken: (state, action: PayloadAction<object>) => {
            state.token = action.payload;
        },
    },
});
export const { login, logout } = UserSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default UserSlice.reducer;