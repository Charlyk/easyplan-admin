import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Notification,
  NotificationsProviderState,
} from './NotificationsProvider.types';

export const initialState: NotificationsProviderState = {
  isVisible: false,
  message: null,
  severity: 'info',
};

const notificationsProviderSlice = createSlice({
  name: 'notificationsProvider',
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<Notification>) {
      state.isVisible = action.payload.show;
      if (!action.payload.show) {
        state.message = null;
        state.severity = 'info';
      } else {
        state.message = action.payload.message;
        state.severity = action.payload.severity;
      }
    },
    closeNotification(state) {
      state.isVisible = false;
      state.message = null;
      state.severity = 'info';
    },
  },
});

export const { setNotification, closeNotification } =
  notificationsProviderSlice.actions;

export default notificationsProviderSlice.reducer;
