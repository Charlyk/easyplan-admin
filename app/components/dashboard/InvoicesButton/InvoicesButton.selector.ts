import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const invoicesButtonSelector = (state: ReduxState) =>
  state.invoicesButton;

export const invoicesListSelector = createSelector(
  invoicesButtonSelector,
  (data) => data.invoices,
);

export const areInvoicesLoadingSelector = createSelector(
  invoicesButtonSelector,
  (data) => data.isLoading,
);
