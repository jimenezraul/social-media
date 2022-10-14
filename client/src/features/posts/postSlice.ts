import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface PostState {
  newPost: boolean;
}

export const PostSlice = createSlice({
  name: "post",
  initialState: {
    newPost: false,
  } as PostState,
  reducers: {
    setNewPost: (state, action: PayloadAction<boolean>) => {
      state.newPost = action.payload;
    },
  },
});
export const { setNewPost } =
  PostSlice.actions;

export const newPost = (state: RootState) => state.newPost;

export default PostSlice.reducer;
