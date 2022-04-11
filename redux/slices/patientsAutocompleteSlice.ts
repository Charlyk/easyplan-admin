import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { Patient } from 'types';

const patientAutocompleteSlice = createSlice({
  name: 'patientAutocomplete',
  initialState: initialState.patientsAutocomplete,
  reducers: {
    dispatchFetchFilteredPatients(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    setSearchedPatients(state, action: PayloadAction<Patient[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    setPaientsErrorMessage(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetData(state) {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  dispatchFetchFilteredPatients,
  setSearchedPatients,
  setPaientsErrorMessage,
  resetData,
} = patientAutocompleteSlice.actions;

export default patientAutocompleteSlice.reducer;
