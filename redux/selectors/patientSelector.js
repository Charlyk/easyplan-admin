import { createSelector } from 'reselect';

export const patientSelector = (state) => state.patient;

export const updateSMSMessageStatusSelector = createSelector(
  patientSelector,
  (patient) => patient.smsMessages.updateMessageStatus,
);
