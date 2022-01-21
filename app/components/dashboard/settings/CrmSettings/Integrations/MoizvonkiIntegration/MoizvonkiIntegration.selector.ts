import { ReduxState } from 'redux/types';

export const moizvonkiIntegrationSelector = (state: ReduxState) =>
  state.moizvonkiConnection;
