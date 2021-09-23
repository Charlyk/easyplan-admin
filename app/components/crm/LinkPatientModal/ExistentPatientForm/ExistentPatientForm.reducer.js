import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isSearching: false,
  patients: [],
  searchQuery: '',
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
      if (action.payload.length === 0) {
        state.patients = [];
      }
    },
  },
});

export const {
  setPatients,
  setIsSearching,
  setSearchQuery,
} = existentPatientFormSlice.actions;

export default existentPatientFormSlice.reducer;
