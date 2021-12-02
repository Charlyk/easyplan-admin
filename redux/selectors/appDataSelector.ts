import { createSelector } from 'reselect';
import { Role } from 'app/utils/constants';
import { ReduxState } from 'redux/types';

export const appDataSelector = (state: ReduxState) => state.appData;

export const currentClinicSelector = createSelector(
  appDataSelector,
  (appData) => appData.currentClinic,
);

export const currentUserSelector = createSelector(
  appDataSelector,
  (appData) => appData.currentUser,
);

export const clinicCabinetsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) => currentClinic?.cabinets ?? [],
);

export const hasCabinetsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) => currentClinic?.cabinets?.length > 0,
);

export const clinicDoctorsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) =>
    (currentClinic?.users ?? []).filter(
      (user) => user.roleInClinic === Role.doctor,
    ),
);
