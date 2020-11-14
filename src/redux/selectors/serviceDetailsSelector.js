import { createSelector } from 'reselect';

export const serviceDetailsModalSelector = state => state.serviceDetailsModal;

export const serviceDetailsModalOpenSelector = createSelector(
  serviceDetailsModalSelector,
  state => state.open,
);

export const serviceDetailsCategorySelector = createSelector(
  serviceDetailsModalSelector,
  state => state.category,
);

export const serviceDetailsServiceSelector = createSelector(
  serviceDetailsModalSelector,
  state => state.service,
);
