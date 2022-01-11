import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    dispatchFetchChangeLogData(state) {
      state.isLoading = true;
    },
    dispatchMarkUpdatesAsRead(state) {
      state;
    },
    setChangeLogDataToStore(state, action: PayloadAction<any>) {
      state.changes = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  openChangeLogModal,
  closeChangeLogModal,
  dispatchFetchChangeLogData,
  setChangeLogDataToStore,
  dispatchMarkUpdatesAsRead,
} = changeLogModalSlice.actions;

export default changeLogModalSlice.reducer;
