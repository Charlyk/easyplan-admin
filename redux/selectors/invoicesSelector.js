import { createSelector } from 'reselect';

export const invoicesSelector = (state) => state.invoices;

export const updateInvoiceSelector = createSelector(
  invoicesSelector,
  (invoices) => invoices.updateInvoice,
);

export const totalInvoicesSelector = createSelector(
  invoicesSelector,
  (invoices) => invoices.totalInvoices,
);
