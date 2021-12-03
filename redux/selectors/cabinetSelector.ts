import { createSelector } from 'reselect';
import { ReduxStateType } from 'store';

export const cabinetsDataSelector = (state: ReduxStateType) =>
  state.cabinetsData;

export const cabinetsSelector = createSelector(
  cabinetsDataSelector,
  (cabinetsData) => cabinetsData.cabinets,
);
