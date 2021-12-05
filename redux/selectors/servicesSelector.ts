import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const servicesListSelector = (state: ReduxState) => state.servicesList;

export const isFetchingServicesSelector = createSelector(
  servicesListSelector,
  (data) => data.isFetching,
);

export const servicesSelector = createSelector(
  servicesListSelector,
  (data) => data.services,
);

export const categoriesSelector = createSelector(
  servicesListSelector,
  (data) => data.categories,
);

export const servicesErrorSelector = createSelector(
  servicesListSelector,
  (data) => data.error,
);
