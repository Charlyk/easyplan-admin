import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { Patient } from 'types';
import { CreatePatientRequest } from 'types/api';

const patientsListSlice = createSlice({
  name: 'patientList',
  initialState: initialState.patientList,
  reducers: {
    dispatchCreatePatient(state, _action: PayloadAction<CreatePatientRequest>) {
      state.isLoading = true;
    },
    fetchPatientList(
      state,
      _action: PayloadAction<{
        query: Record<string, string>;
      }>,
    ) {
      state.isLoading = true;
    },
    addNewPatient(state, action: PayloadAction<Patient>) {
      state.patients.data = orderBy(
        [...state.patients.data, action.payload],
        ['fullName'],
        ['asc'],
      );
      state.newPatient = action.payload;
      state.isLoading = false;
    },
    requestDeletePatient(state, _action: PayloadAction<number>) {
      state.isDeleting = true;
    },
    setPatients(
      state,
      action: PayloadAction<{ data: Patient[]; total: number }>,
    ) {
      state.patients.total = action.payload.total;
      state.patients.data = orderBy(action.payload.data, ['fullName'], ['asc']);
      state.isLoading = false;
    },
    deletePatient(state, action: PayloadAction<number>) {
      state.patients.data = state.patients.data.filter(
        (patient) => patient.id !== action.payload,
      );
      state.patients.total = state.patients.data.length;
      state.isDeleting = false;
    },
    setCreatedPatient(state, action: PayloadAction<Patient | null>) {
      state.newPatient = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.patientList,
      };
    },
  },
});

export const {
  fetchPatientList,
  setPatients,
  requestDeletePatient,
  deletePatient,
  dispatchCreatePatient,
  addNewPatient,
  setCreatedPatient,
} = patientsListSlice.actions;

export default patientsListSlice.reducer;
