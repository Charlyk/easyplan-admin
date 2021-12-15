import { IncomingHttpHeaders } from 'http';
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
        headers: IncomingHttpHeaders;
      }>,
    ) {
      state.isLoading = true;
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

export const { fetchPatientList, setPatients, deletePatient } =
  patientsListSlice.actions;

export default patientsListSlice.reducer;
