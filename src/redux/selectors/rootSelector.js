import { createSelector } from 'reselect';

export const mainSelector = state => state.main;

export const updateCalendarDoctorHeightSelector = createSelector(
  mainSelector,
  state => state.updateCalendarDoctorHeight,
);

export const checkAppointmentsSelector = createSelector(
  mainSelector,
  state => state.checkAppointments,
);

export const updateInvoicesSelector = createSelector(
  mainSelector,
  state => state.updateInvoices,
);

export const checkDoctorAppointmentsSelector = createSelector(
  mainSelector,
  state => state.checkDoctorAppointments,
);

export const updateCategoriesSelector = createSelector(
  mainSelector,
  state => state.updateCategories,
);

export const updateUsersSelector = createSelector(
  mainSelector,
  state => state.updateUsers,
);

export const updateNotesSelector = createSelector(
  mainSelector,
  state => state.updateNotes,
);

export const updateXRaySelector = createSelector(
  mainSelector,
  state => state.updateXRay,
);

export const updateCurrentUserSelector = createSelector(
  mainSelector,
  state => state.updateCurrentUser,
);

export const updateServicesSelector = createSelector(
  mainSelector,
  state => state.updateServices,
);

export const updateAppointmentsSelector = createSelector(
  mainSelector,
  state => state.updateAppointments,
);

export const newClinicIdSelector = createSelector(
  mainSelector,
  state => state.newClinicId,
);

export const logoutSelector = createSelector(
  mainSelector,
  state => state.logout,
);

export const userSelector = createSelector(mainSelector, state => state.user);

export const patientDetailsSelector = createSelector(
  mainSelector,
  state => state.patientDetails,
);

export const updatePatientsListSelector = createSelector(
  mainSelector,
  state => state.updatePatients,
);
