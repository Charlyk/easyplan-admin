import { createSelector } from 'reselect';

export const clinicSelector = state => state.clinic;

export const clinicDetailsSelector = createSelector(
  clinicSelector,
  state => state.clinic,
);

export const clinicDoctorsSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.users.filter(item => item.roleInClinic === 'DOCTOR'),
);

export const clinicServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services,
);
