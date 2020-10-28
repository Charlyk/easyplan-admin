import { createSelector } from 'reselect';

export const clinicSelector = state => state.clinic;

export const clinicDoctorsSelector = createSelector(
  clinicSelector,
  clinic => clinic.doctors,
);

export const clinicServicesSelector = createSelector(
  clinicSelector,
  clinic => clinic.services,
);

export const clinicDetailsSelector = createSelector(
  clinicSelector,
  state => state.clinic,
);
