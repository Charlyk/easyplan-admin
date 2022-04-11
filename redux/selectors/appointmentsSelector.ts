import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const appointmentSelector = (state: ReduxState) => state.appointments;

export const formDataSelector = createSelector(
  appointmentSelector,
  (state) => state.formData,
);

export const appointmentModalSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.modalProps,
);

export const newPatientModalOpenSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.newPatientsModalOpen,
);

export const appointmentDoctorsSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.doctors,
);

export const appointmentServicesSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.services,
);

export const appointmentStartHoursSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.startHours,
);

export const appointmentEndHoursSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.endHours,
);

export const appointmentSchedulesSelector = createSelector(
  appointmentSelector,
  (appointments) => appointments.schedules,
);
