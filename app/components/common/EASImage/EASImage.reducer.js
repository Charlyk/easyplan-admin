import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  isError: false,
  imageContent: null,
  isAttached: false,
};

const easImageSlice = createSlice({
  name: 'easImage',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.isError = false;
        state.imageContent = null;
      }
    },
    setIsError(state, action) {
      state.isError = action.payload;
      if (action.payload) {
        state.isLoading = false;
      }
    },
    setImageContent(state, action) {
      state.imageContent = action.payload;
      state.isLoading = false;
      state.isError = false;
    },
    setIsAttached(state, action) {
      state.isAttached = action.payload;
    },
  },
});

export const { setIsError, setIsLoading, setImageContent, setIsAttached } =
  easImageSlice.actions;

export default easImageSlice.reducer;
