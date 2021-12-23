import { ReduxState } from 'redux/types';

export const patientPhoneRecordsSelector = (state: ReduxState) =>
  state.patientPhoneCalls;
