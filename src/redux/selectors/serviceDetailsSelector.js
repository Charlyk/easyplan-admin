import { createSelector } from 'reselect';

export const serviceDetailsModalSelector = state => state.serviceDetailsModal;

export const serviceDetailsModalOpenSelector = createSelector(
  serviceDetailsModalSelector,
  state => state.open,
);
