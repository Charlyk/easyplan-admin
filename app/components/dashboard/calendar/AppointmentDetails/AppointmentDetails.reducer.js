import { createSlice } from '@reduxjs/toolkit';
import { Statuses } from 'app/utils/constants';

export const initialState = {
  isLoading: false,
  showStatuses: false,
  isCanceledReasonRequired: false,
  isDelayTimeRequired: false,
  scheduleStatus: Statuses[0],
  isNewDateRequired: false,
};

const appointmentDetailsSlice = createSlice({
  name: 'appointmentDetails',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setShowStatuses(state, action) {
      state.showStatuses = action.payload;
    },
    setIsCanceledReasonRequired(state, action) {
      state.isCanceledReasonRequired = action.payload;
      if (action.payload) {
        state.showStatuses = false;
      }
    },
    setIsNewDateRequired(state, action) {
      state.isNewDateRequired = action.payload;
      if (action.payload) {
        state.showStatuses = false;
      }
    },
    setScheduleStatus(state, action) {
      state.scheduleStatus = action.payload;
    },
    setIsDelayTimeRequired(state, action) {
      state.isDelayTimeRequired = action.payload;
      if (action.payload) {
        state.showStatuses = false;
      }
    },
  },
});

export const {
  setIsLoading,
  setShowStatuses,
  setIsCanceledReasonRequired,
  setIsNewDateRequired,
  setScheduleStatus,
  setIsDelayTimeRequired,
} = appointmentDetailsSlice.actions;

export default appointmentDetailsSlice.reducer;
