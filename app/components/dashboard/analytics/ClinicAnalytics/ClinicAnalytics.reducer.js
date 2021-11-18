import moment from "moment-timezone";
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  doctors: [],
  selectedDoctor: { id: -1 },
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
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
    },
    setShowRangePicker(state, action) {
      state.showRangePicker = action.payload;
    },
    setSelectedRange(state, action) {
      state.selectedRange = action.payload;
    },
    setInitialQuery(state, action) {
      const { doctorId, fromDate, toDate } = action.payload;
      state.selectedDoctor = { id: parseInt(doctorId) };
      state.selectedRange = [
        moment(fromDate).toDate(),
        moment(toDate).toDate(),
      ];
    }
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
