import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const patientsSelector = (state: ReduxState) => state.patients;

export const patientsDataSelector = createSelector(
  patientsSelector,
  (state) => state.data,
);

export const totalPatientsSelector = createSelector(
  patientsDataSelector,
  (state) => state?.total ?? 0,
);

export const patientsLoadingSelector = createSelector(
  patientsSelector,
  (state) => state.loading,
);
