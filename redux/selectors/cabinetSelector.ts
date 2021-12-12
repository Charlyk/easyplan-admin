import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const cabinetsDataSelector = (state: ReduxState) => state.cabinetsData;

export const cabinetsSelector = createSelector(
  cabinetsDataSelector,
  (cabinetsData) => cabinetsData.cabinets,
);
