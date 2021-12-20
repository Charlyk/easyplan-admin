import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DoctorScheduleDetails } from 'types';
import initialState from '../initialState';

const doctorScheduleDetailsSlice = createSlice({
  name: 'doctorScheduleDetails',
  initialState: initialState.doctorScheduleDetails,
  reducers: {
    fetchDoctorScheduleDetails(state, _action: PayloadAction<number>) {
      state.isFetching = true;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
    setScheduleDetails(state, action: PayloadAction<DoctorScheduleDetails>) {
      state.schedule = action.payload;
      state.isFetching = false;
    },
    setScheduleDetailsData(
      state,
      action: PayloadAction<{
        schedule: DoctorScheduleDetails;
        scheduleId: number;
      }>,
    ) {
      state.schedule = action.payload.schedule;
      state.scheduleId = action.payload.scheduleId;
      state.isFetching = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.isFetching = false;
      state.error = action.payload;
    },
  },
});

export const {
  setScheduleDetails,
  setError,
  fetchDoctorScheduleDetails,
  setIsFetching,
  setScheduleDetailsData,
} = doctorScheduleDetailsSlice.actions;

export default doctorScheduleDetailsSlice.reducer;
