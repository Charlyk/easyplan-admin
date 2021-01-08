import { createSelector } from 'reselect';

import { Role } from '../../utils/constants';

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
  users => users.filter(item => item.roleInClinic === Role.doctor),
);

export const clinicActiveDoctorsSelector = createSelector(
  clinicDoctorsSelector,
  doctors => doctors.filter(item => !item.isHidden),
);

export const clinicServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services?.filter(item => !item.deleted) || [],
);

export const clinicAllServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services || [],
);

export const clinicBracesServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic?.services?.filter(item => item.serviceType === 'Braces'),
);

export const clinicBracesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.braces,
);

export const clinicEnabledBracesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic?.braces?.filter(item => item.isEnabled) || [],
);
