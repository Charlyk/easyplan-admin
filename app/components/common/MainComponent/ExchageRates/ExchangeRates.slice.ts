import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { ExchangeRate } from 'types';

const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState: initialState.exchangeRates,
  reducers: {
    fetchExchangeRatesList(state) {
      state.isFetching = true;
    },
    setExchangeRates(state, action: PayloadAction<ExchangeRate[]>) {
      state.rates = action.payload;
      state.isFetching = false;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.exchangeRates,
      };
    },
  },
});

export const { fetchExchangeRatesList, setExchangeRates, setIsFetching } =
  exchangeRatesSlice.actions;

export default exchangeRatesSlice.reducer;
