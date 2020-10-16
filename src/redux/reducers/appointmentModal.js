import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  date: null,
  doctor: null,
  schedule: null,
});

export default function appointmentModal(state = initialState, action) {
  switch (action.type) {
    case types.setAppointmentModal:
      return {
        ...state,
        ...action.payload,
        date: action.payload.open ? action.payload.date : null,
        doctor: action.payload.open ? action.payload.doctor : null,
      };
    default:
      return state;
  }
}
