import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { CreateAppointmentModalState } from 'redux/types';

const createAppointmentModalSlice = createSlice({
  name: 'createAppointmentModal',
  initialState: initialState.appointmentModal,
  reducers: {
    openAppointmentModal(
      state,
      action: PayloadAction<CreateAppointmentModalState>,
    ) {
      return {
        ...action.payload,
        date:
          action.payload.date != null
            ? moment(action.payload.date).format('YYYY-MM-DD')
            : null,
      };
    },
    closeAppointmentModal(_state) {
      return initialState.appointmentModal;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.appointmentModal,
      };
    },
  },
});

export const { openAppointmentModal, closeAppointmentModal } =
  createAppointmentModalSlice.actions;

export default createAppointmentModalSlice.reducer;
