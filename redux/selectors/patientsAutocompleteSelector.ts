import { ReduxState } from 'redux/types';

export const patientsAutocompleteSelector = (state: ReduxState) =>
  state.patientsAutocomplete;
