import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { Patient } from 'types';

const patientsListSlice = createSlice({
  name: 'patientList',
  initialState: initialState.patientList,
  reducers: {
    fetchPatientList(
      state,
      _action: PayloadAction<{
        query: Record<string, string>;
      }>,
    ) {
      state.isLoading = true;
    },
    requestDeletePatient(state, _action: PayloadAction<number>) {
      state.isDeleting = true;
    },
    setPatients(
      state,
      action: PayloadAction<{ data: Patient[]; total: number }>,
    ) {
      state.patients = action.payload;
      state.isLoading = false;
    },
    deletePatient(state, action: PayloadAction<number>) {
      state.patients.data = state.patients.data.filter(
        (patient) => patient.id !== action.payload,
      );
      state.patients.total = state.patients.data.length;
      state.isDeleting = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.patientsList,
      };
    },
  },
});

export const {
  fetchPatientList,
  setPatients,
  requestDeletePatient,
  deletePatient,
} = patientsListSlice.actions;

export default patientsListSlice.reducer;
