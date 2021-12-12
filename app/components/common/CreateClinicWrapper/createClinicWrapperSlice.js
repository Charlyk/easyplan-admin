import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
};

const createClinicWrapperSlice = createSlice({
  name: 'createClinicWrapper',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = createClinicWrapperSlice.actions;

export default createClinicWrapperSlice.reducer;
