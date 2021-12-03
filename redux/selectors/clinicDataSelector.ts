import { createSelector } from 'reselect';
import { ReduxStateType } from 'store';

export const clinicDataSelector = (state: ReduxStateType) => state.clinicData;

export const updateClinicDataSelector = createSelector(
  clinicDataSelector,
  (clinicData) => clinicData?.updateClinicData,
);

export const userClinicAccessChangeSelector = createSelector(
  clinicDataSelector,
  (clinicData) => clinicData?.userClinicAccessChange,
);
