import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { PatientCallRecord } from 'types';
import { PatientPhoneRecordsRequest } from 'types/api';

const patientPhoneRecordsSlice = createSlice({
  name: 'patientPhoneCalls',
  initialState: initialState.patientPhoneCalls,
  reducers: {
    dispatchFetchCallRecords(
      state,
      _action: PayloadAction<PatientPhoneRecordsRequest>,
    ) {
      state.records = [];
      state.isFetching = true;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
    setCallRecords(state, action: PayloadAction<PatientCallRecord[]>) {
      state.records = action.payload;
      state.isFetching = false;
    },
  },
});

export const { dispatchFetchCallRecords, setCallRecords, setIsFetching } =
  patientPhoneRecordsSlice.actions;

export default patientPhoneRecordsSlice.reducer;
