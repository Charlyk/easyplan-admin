import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';

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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.crm,
      };
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
