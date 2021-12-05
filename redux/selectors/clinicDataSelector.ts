import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const clinicDataSelector = (state: ReduxState) => state.clinicData;

export const updateClinicDataSelector = createSelector(
  clinicDataSelector,
  (clinicData) => clinicData?.updateClinicData,
);

export const userClinicAccessChangeSelector = createSelector(
  clinicDataSelector,
  (clinicData) => clinicData?.userClinicAccessChange,
);
