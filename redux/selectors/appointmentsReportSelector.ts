import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const appointmentsReportsSelector = (state: ReduxState) =>
  state.appointmentsReports;

export const appointmentsReportsDataSelector = createSelector(
  appointmentsReportsSelector,
  (state) => state?.data,
);

export const isAppointmentsReportsLoadingSelector = createSelector(
  appointmentsReportsSelector,
  (state) => state?.loading,
);
