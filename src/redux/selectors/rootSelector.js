import { createSelector } from 'reselect';

export const mainSelector = state => state.main;

export const updateCalendarDoctorHeightSelector = createSelector(
  mainSelector,
  state => state.updateCalendarDoctorHeight,
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
