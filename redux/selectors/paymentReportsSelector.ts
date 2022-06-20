import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const paymentReportsSelector = (state: ReduxState) =>
  state.paymentReports;

export const paymentReportsDataSelector = createSelector(
  paymentReportsSelector,
  (state) => state.data,
);

export const isPaymentReportsLoadingSelector = createSelector(
  paymentReportsSelector,
  (state) => state.loading,
);
