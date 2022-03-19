import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import initialState from 'redux/initialState';
import { PatientVisit } from 'types';
import { UpdateVisitRequest } from 'types/api';

const appointmentNotesSlice = createSlice({
  name: 'patientAppointmentNotes',
  initialState: initialState.patientVisits,
  reducers: {
    dispatchUpdateVisit(state, _action: PayloadAction<UpdateVisitRequest>) {
      state.isFetching = true;
    },
    dispatchFetchPatientVisits(state, _action: PayloadAction<number>) {
      state.isFetching = true;
      state.visits = [];
    },
    setPatientVisits(state, action: PayloadAction<PatientVisit[]>) {
      state.visits = orderBy(action.payload, 'created', 'desc');
      state.isFetching = false;
    },
    updatePatientVisit(state, action: PayloadAction<PatientVisit>) {
      state.isFetching = false;
      state.visits = state.visits.map((visit) => {
        if (visit.id !== action.payload.id) {
          return visit;
        }
        return {
          ...visit,
          ...action.payload,
        };
      });
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
  },
});

export const {
  dispatchUpdateVisit,
  dispatchFetchPatientVisits,
  setPatientVisits,
  setIsFetching,
  updatePatientVisit,
} = appointmentNotesSlice.actions;

export default appointmentNotesSlice.reducer;
