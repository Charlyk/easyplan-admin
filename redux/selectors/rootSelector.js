import { createSelector } from 'reselect';

export const mainSelector = (state) => state.main;

export const updateInvoicesSelector = createSelector(
  mainSelector,
  (state) => state.updateInvoices,
);

export const updateNotesSelector = createSelector(
  mainSelector,
  (state) => state.updateNotes,
);

export const updateXRaySelector = createSelector(
  mainSelector,
  (state) => state.updateXRay,
);

export const updateServicesSelector = createSelector(
  mainSelector,
  (state) => state.updateServices,
);

export const updateAppointmentsSelector = createSelector(
  mainSelector,
  (state) => state.updateAppointments,
);

export const logoutSelector = createSelector(
  mainSelector,
  (state) => state.logout,
);

export const userSelector = createSelector(mainSelector, (state) => state.user);

export const patientDetailsSelector = createSelector(
  mainSelector,
  (state) => state.patientDetails,
);

export const updatePatientsListSelector = createSelector(
  mainSelector,
  (state) => state.updatePatients,
);

export const isImportModalOpenSelector = createSelector(
  mainSelector,
  (state) => state.isImportModalOpen,
);

export const updateExchangeRatesSelector = createSelector(
  mainSelector,
  (state) => state.updateExchangeRates,
);

export const updateHourIndicatorPositionSelector = createSelector(
  mainSelector,
  (state) => state.updateHourIndicatorTop,
);

export const phoneCallRecordSelector = createSelector(
  mainSelector,
  (state) => state.callToPlay,
);
