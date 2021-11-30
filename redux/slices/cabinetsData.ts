import { createSlice } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';

const cabinetsData = createSlice({
  name: 'cabinetsData',
  initialState: initialState.cabinetsData,
  reducers: {
    addNewCabinet(state, action) {
      state.cabinets.push(action.payload);
    },
  },
});

export const { addNewCabinet } = cabinetsData.actions;

export default cabinetsData.reducer;
