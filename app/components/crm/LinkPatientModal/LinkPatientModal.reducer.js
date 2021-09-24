import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  currentTab: '0',
  patientData: null,
  isLoading: false,
}

const linkPatientModalSlice = createSlice({
  name: 'linkPatientModal',
  initialState,
  reducers: {
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    setPatientData(state, action) {
      state.patientData = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    resetState() {
      return initialState;
    }
  },
});

export const {
  setIsLoading,
  setPatientData,
  setCurrentTab,
  resetState,
} = linkPatientModalSlice.actions;

export default linkPatientModalSlice.reducer;
