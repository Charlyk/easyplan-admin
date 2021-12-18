import { ReduxState } from 'redux/types';

export const clinicAnalyticsSelector = (state: ReduxState) =>
  state.clinicAnalytics;
