import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import {
  ClinicAnalyticsQuery,
  ClinicAnalyticsState,
} from './ClinicAnalytics.types';

export const initialState: ClinicAnalyticsState = {
  doctors: [],
  showRangePicker: false,
  selectedRange: [
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ],
};

const clinicAnalyticsSlice = createSlice({
  name: 'clinicAnalytics',
  initialState,
  reducers: {
    setDoctors(state, action: PayloadAction<Easyplan.ClinicUser[]>) {
      state.doctors = action.payload;
    },
    setSelectedDoctor(state, action: PayloadAction<Easyplan.ClinicUser>) {
      state.selectedDoctor = action.payload;
    },
    setShowRangePicker(state, action: PayloadAction<boolean>) {
      state.showRangePicker = action.payload;
    },
    setSelectedRange(state, action: PayloadAction<[Date, Date]>) {
      state.selectedRange = action.payload;
    },
    setInitialQuery(state, action: PayloadAction<ClinicAnalyticsQuery>) {
      const { doctorId, startDate, endDate } = action.payload;
      state.selectedDoctor = state.doctors.find(
        (doctor) => doctor.id === parseInt(doctorId),
      );
      state.selectedRange = [
        moment(startDate).toDate(),
        moment(endDate).toDate(),
      ];
    },
  },
});

export const {
  setSelectedDoctor,
  setInitialQuery,
  setSelectedRange,
  setShowRangePicker,
  setDoctors,
} = clinicAnalyticsSlice.actions;

export default clinicAnalyticsSlice.reducer;
