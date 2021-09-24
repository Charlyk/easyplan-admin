import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isSearching: false,
  patients: [],
  searchQuery: '',
  selectedPatient: null,
};

const existentPatientFormSlice = createSlice({
  name: 'existentPatientForm',
  initialState,
  reducers: {
    setIsSearching(state, action) {
      if (action.payload) {
        state.patients = [];
      }
      state.isSearching = action.payload;
    },
    setPatients(state, action) {
      state.patients = action.payload;
      state.isSearching = false;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.selectedPatient = null;
      if (action.payload.length < 3) {
        state.patients = [];
      }
    },
    setSelectedPatient(state, action) {
      state.selectedPatient = action.payload;
    },
  },
});

export const {
  setPatients,
  setIsSearching,
  setSearchQuery,
  setSelectedPatient,
} = existentPatientFormSlice.actions;

export default existentPatientFormSlice.reducer;
