import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const exchangeRatesSelector = (state: ReduxState) => state.exchangeRates;

export const exchangeRatesListSelector = createSelector(
  exchangeRatesSelector,
  (data) => data.rates,
);

export const isExchangeRatesFetchingSelector = createSelector(
  exchangeRatesSelector,
  (data) => data.isFetching,
);
