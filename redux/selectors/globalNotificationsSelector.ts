import { ReduxState } from 'redux/types';

export const globalNotificationsSelector = (state: ReduxState) =>
  state.globalNotifications;
