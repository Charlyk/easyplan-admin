import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentReportsPayload } from 'types/api/request';
import { AppointmentReportResponse } from 'types/api/response';
import initialState from '../initialState';

const appointmentsReports = createSlice({
  name: 'appointmentReports',
  initialState: initialState.appointmentsReports,
  reducers: {
    fetchAppointmentReports(
      state,
      _action: PayloadAction<AppointmentReportsPayload>,
    ) {
      state.loading = true;
    },
    setAppointmentReports(
      state,
      action: PayloadAction<AppointmentReportResponse>,
    ) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAppointmentReportsError(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAppointmentReports,
  setAppointmentReports,
  setAppointmentReportsError,
} = appointmentsReports.actions;

export default appointmentsReports.reducer;
