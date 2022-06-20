import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PaymentReportsGetRequest } from 'types/api/request';
import { PaymentReportResponse } from 'types/api/response';
import initialState from '../initialState';

const paymentReportsSlice = createSlice({
  name: 'paymentReports',
  initialState: initialState.paymentReports,
  reducers: {
    fetchPaymentReports(
      state,
      _action: PayloadAction<PaymentReportsGetRequest>,
    ) {
      state.loading = true;
    },
    setPaymentReports(state, action: PayloadAction<PaymentReportResponse>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPaymentReportsError(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.paymentReports,
      };
    },
  },
});

export const {
  fetchPaymentReports,
  setPaymentReports,
  setPaymentReportsError,
} = paymentReportsSlice.actions;

export default paymentReportsSlice.reducer;
