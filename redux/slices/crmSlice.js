import { createSlice } from '@reduxjs/toolkit';
import initialState from '../initialState';

const crmSlice = createSlice({
  name: 'crm',
  initialState: initialState.crm,
  reducers: {
    setUpdatedDeal(state, action) {
      state.updatedDeal = action.payload;
    },
    setDeletedDeal(state, action) {
      state.deletedDeal = action.payload;
    },
    setNewDeal(state, action) {
      state.newDeal = action.payload;
    },
    setUpdatedReminder(state, action) {
      state.updatedReminder = action.payload;
    },
    setNewReminder(state, action) {
      state.newReminder = action.payload;
    },
  },
});

export const {
  setNewDeal,
  setUpdatedDeal,
  setDeletedDeal,
  setUpdatedReminder,
  setNewReminder,
} = crmSlice.actions;

export default crmSlice.reducer;
