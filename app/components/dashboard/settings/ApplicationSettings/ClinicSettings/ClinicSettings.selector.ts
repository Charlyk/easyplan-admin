import { ReduxState } from 'redux/types';

export const clinicSettingsSelector = (state: ReduxState) =>
  state.clinicSettings;
