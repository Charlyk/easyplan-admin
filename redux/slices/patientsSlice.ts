import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { Patient } from 'types';
import {
  FetchPatientsRequest,
  PaginatedResponse,
  CreatePatientBody,
} from 'types/api';
import initialState from '../initialState';

const patientsSlice = createSlice({
  name: 'patients',
  initialState: initialState.patients,
  reducers: {
    dispatchFetchPatients(state, action: PayloadAction<FetchPatientsRequest>) {
      state.loading = true;
      if (action.payload.page === 0) {
        state.data = null;
      }
      state.error = null;
    },
    dispatchCreateAppointmentPatient(
      state,
      _action: PayloadAction<CreatePatientBody>,
    ) {
      state.loading = true;
    },
    setPatients(state, action: PayloadAction<PaginatedResponse<Patient>>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPatients(state, action: PayloadAction<PaginatedResponse<Patient>>) {
      state.data = {
        ...action.payload,
        data: [...(state.data?.data ?? []), ...action.payload.data],
      };
      state.loading = false;
      state.error = null;
    },

    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  dispatchFetchPatients,
  dispatchCreateAppointmentPatient,
  setPatients,
  setErrorMessage,
  setIsLoading,
  addPatients,
} = patientsSlice.actions;

export default patientsSlice.reducer;
