import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const pendingConsultationsSelector = (state: ReduxState) =>
  state.pendingConsultations;

export const pendingConsultationsDataSelector = createSelector(
  pendingConsultationsSelector,
  (state) => state.data,
);

export const isPendingConsultationsLoadingSelector = createSelector(
  pendingConsultationsSelector,
  (state) => state.loading,
);
