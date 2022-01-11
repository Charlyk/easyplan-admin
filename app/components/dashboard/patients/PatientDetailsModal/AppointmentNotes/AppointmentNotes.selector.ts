import { ReduxState } from 'redux/types';

export const appointmentNotesSelector = (state: ReduxState) =>
  state.patientVisits;
