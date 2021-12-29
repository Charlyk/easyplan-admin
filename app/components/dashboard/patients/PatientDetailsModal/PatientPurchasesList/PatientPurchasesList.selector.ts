import { ReduxState } from 'redux/types';

export const patientPurchasesListSelector = (state: ReduxState) =>
  state.patientPurchases;
