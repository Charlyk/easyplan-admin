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

export const arePatientsLoadingSelector = createSelector(
  patientListSelector,
  (patientList) => patientList.isLoading,
);

export const isPatientBeingDeletedSelector = createSelector(
  patientListSelector,
  (patientList) => patientList.isDeleting,
);

export const createdPatientSelector = createSelector(
  patientListSelector,
  (data) => data.newPatient,
);
