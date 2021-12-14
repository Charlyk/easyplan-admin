import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { Patient } from 'types';

const patientsListSlice = createSlice({
  name: 'patientList',
  initialState: initialState.patientList,
  reducers: {
    setPatients(
      state,
      action: PayloadAction<{ data: Patient[]; total: number }>,
    ) {
      state.patients = action.payload;
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

export const { setPatients, deletePatient } = patientsListSlice.actions;

export default patientsListSlice.reducer;
