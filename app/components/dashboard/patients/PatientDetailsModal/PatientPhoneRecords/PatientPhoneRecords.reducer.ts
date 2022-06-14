import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { PatientCallRecord } from 'types';
import {
  PatientPhoneRecordsRequest,
  UpdatePatientPhonePayload,
} from 'types/api';

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
    dispatchUpdateCallRecords(
      state,
      _action: PayloadAction<UpdatePatientPhonePayload>,
    ) {
      state.isFetching = true;
    },
    updateCallRecords(state, action: PayloadAction<PatientCallRecord>) {
      const updatedRecord = action.payload;
      state.isFetching = false;
      state.records = state.records.map((record) =>
        record.id === updatedRecord.id
          ? { ...record, ...updatedRecord }
          : record,
      );
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

export const {
  dispatchFetchCallRecords,
  setCallRecords,
  setIsFetching,
  dispatchUpdateCallRecords,
  updateCallRecords,
} = patientPhoneRecordsSlice.actions;

export default patientPhoneRecordsSlice.reducer;
