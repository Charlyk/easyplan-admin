import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const servicesListSelector = (state: ReduxState) => state.servicesList;
export const servicesListFromRoot = (state: ReduxState) =>
  state.appData.currentClinic.services;

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

export const serviceDetailsSelector = createSelector(
  servicesListSelector,
  (data) => data.details,
);

export const isFetchingDetailsSelector = createSelector(
  servicesListSelector,
  (data) => data.isFetchingDetails,
);

export const detailsModalSelector = createSelector(
  servicesListSelector,
  (data) => data.detailsModal,
);

export const activeServicesFromRoot = createSelector(
  servicesListFromRoot,
  (data) => data.filter((service) => !service.deleted),
);
