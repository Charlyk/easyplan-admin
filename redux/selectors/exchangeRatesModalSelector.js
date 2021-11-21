import { createSelector } from 'reselect';

export const exchangeRatesModalSelector = (state) => state.exchangeRatesModal;

export const isExchangeRateModalOpenSelector = createSelector(
  exchangeRatesModalSelector,
  (state) => state.open,
);
