import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { AppNotification } from 'types';

const globalNotificationViewSlice = createSlice({
  name: 'appNotification',
  initialState: initialState.appNotification,
  reducers: {
    dispatchFetchUnreadNotification(state) {
      state.notification = null;
      state.isLoading = true;
    },
    dispatchMarkNotificationAsRead(state, _action: PayloadAction<number>) {
      state.notification = null;
      state.isLoading = true;
    },
    setAppNotification(state, action: PayloadAction<AppNotification | null>) {
      if (!action.payload) {
        // this is handling empty strings
        state.notification = null;
      } else {
        state.notification = action.payload;
      }
      state.isLoading = false;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  dispatchFetchUnreadNotification,
  dispatchMarkNotificationAsRead,
  setIsLoading,
  setAppNotification,
} = globalNotificationViewSlice.actions;

export default globalNotificationViewSlice.reducer;
