import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const patientSelector = (state: ReduxState) => state.patientDetails;

export const updateSMSMessageStatusSelector = createSelector(
  patientSelector,
  (patient) => patient.smsMessages.updateMessageStatus,
);
