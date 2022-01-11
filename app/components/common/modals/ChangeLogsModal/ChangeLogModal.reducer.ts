import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';

const changeLogModalSlice = createSlice({
  name: 'ChangeLogModal',
  initialState: initialState.changeLogModal,
  reducers: {
    openChangeLogModal(state, _action) {
      state.open = true;
    },
    closeChangeLogModal(state, _action) {
      state.open = false;
    },
  },
});

export const { openChangeLogModal, closeChangeLogModal } =
  changeLogModalSlice.actions;

export default changeLogModalSlice.reducer;
