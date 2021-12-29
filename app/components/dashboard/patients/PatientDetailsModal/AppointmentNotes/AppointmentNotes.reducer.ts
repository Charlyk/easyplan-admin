import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import initialState from 'redux/initialState';
import { PatientVisit } from 'types';

const appointmentNotesSlice = createSlice({
  name: 'patientAppointmentNotes',
  initialState: initialState.patientVisits,
  reducers: {
    dispatchFetchPatientVisits(state, _action: PayloadAction<number>) {
      state.isFetching = true;
    },
    setPatientVisits(state, action: PayloadAction<PatientVisit[]>) {
      state.visits = orderBy(action.payload, 'created', 'desc');
      state.isFetching = false;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
  },
});

export const { dispatchFetchPatientVisits, setPatientVisits, setIsFetching } =
  appointmentNotesSlice.actions;

export default appointmentNotesSlice.reducer;
