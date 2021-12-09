import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { NotificationSeverity } from 'types';

const globalNotificationsSlice = createSlice({
  name: 'globalNotifications',
  initialState: initialState.globalNotifications,
  reducers: {
    showNotification(
      state,
      action: PayloadAction<{
        message: any;
        severity?: NotificationSeverity;
      }>,
    ) {
      state.message = action.payload.message;
      state.severity = action.payload.severity ?? NotificationSeverity.info;
    },
    hideNotification(state) {
      state.message = null;
      state.severity = null;
    },
    showInfoNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.severity = NotificationSeverity.info;
    },
    showErrorNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.severity = NotificationSeverity.error;
    },
    showSuccessNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.severity = NotificationSeverity.success;
    },
    showWarningNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.severity = NotificationSeverity.warning;
    },
  },
});

export const {
  showNotification,
  hideNotification,
  showSuccessNotification,
  showErrorNotification,
  showInfoNotification,
  showWarningNotification,
} = globalNotificationsSlice.actions;

export default globalNotificationsSlice.reducer;
