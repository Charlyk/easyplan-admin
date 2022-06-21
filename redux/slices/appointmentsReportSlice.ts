import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PaymentReportsGetRequest } from 'types/api/request';
import { PaymentReportResponse } from 'types/api/response';
import initialState from '../initialState';

const appointmentsReport = createSlice({
  name: 'paymentReports',
  initialState: initialState.appointmentsReports,
  reducers: {
    fetchPAppointmentReports(
      state,
      _action: PayloadAction<PaymentReportsGetRequest>,
    ) {
      state.loading = true;
    },
    setAppointmentReports(state, action: PayloadAction<PaymentReportResponse>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAppointmentReportsError(state, action: PayloadAction<string | null>) {
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
  fetchPAppointmentReports,
  setAppointmentReports,
  setAppointmentReportsError,
} = appointmentsReport.actions;

export default appointmentsReport.reducer;
