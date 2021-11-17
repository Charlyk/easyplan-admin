import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  patient: null,
  schedule: null,
  selectedServices: [],
  showFinalizeTreatment: false,
  isFinalizing: false,
  finalServices: [],
};

const doctorPatientDetailsSlice = createSlice({
  name: 'doctorPatientDetails',
  initialState,
  reducers: {
    setPatient(state, action) {
      state.patient = action.payload;
    },
    setSchedule(state, action) {
      state.schedule = action.payload;
    },
    setShowFinalizeTreatment(state, action) {
      const { open, finalServices, selectedServices } = action.payload;
      state.showFinalizeTreatment = open;
      state.finalServices = finalServices;
      state.selectedServices = selectedServices;
    },
    setIsFinalizing(state, action) {
      state.isFinalizing = action.payload;
    },
    setInitialData(state, action) {
      const { schedule } = action.payload;
      state.schedule = schedule;
      state.patient = schedule.patient;
    },
  },
});

export const {
  setShowFinalizeTreatment,
  setSchedule,
  setPatient,
  setInitialData,
  setIsFinalizing,
} = doctorPatientDetailsSlice.actions

export default doctorPatientDetailsSlice.reducer
