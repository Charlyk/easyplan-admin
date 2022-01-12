import { ReduxState } from 'redux/types';

export const appNotificationSelector = (state: ReduxState) =>
  state.appNotification;
