import { ReduxState } from 'redux/types';

export const exchangeRatesSelector = (state: ReduxState) => state.exchangeRates;
