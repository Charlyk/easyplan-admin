import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const patientSelector = (state: ReduxState) => state.patientDetails;
export const patientListSelector = (state: ReduxState) => state.patientList;

export const updateSMSMessageStatusSelector = createSelector(
  patientSelector,
  (patient) => patient?.smsMessages.updateMessageStatus,
);

export const globalPatientListSelector = createSelector(
  patientListSelector,
  (patientList) => patientList.patients,
);

export const patientIsLoadingSelector = createSelector(
  patientListSelector,
  (patientList) => patientList.isLoading,
);
