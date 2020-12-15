import { createSelector } from 'reselect';

export const clinicSelector = state => state.clinic;

export const clinicDetailsSelector = createSelector(
  clinicSelector,
  state => state.clinic,
);

export const clinicUsersSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.users,
);

export const clinicDoctorsSelector = createSelector(
  clinicUsersSelector,
  users => users.filter(item => item.roleInClinic === 'DOCTOR'),
);

export const clinicServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services,
);
