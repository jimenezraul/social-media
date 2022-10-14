import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userSlice from '../features/users/userSlice';
import postSlice from '../features/posts/postSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    newPost: postSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
