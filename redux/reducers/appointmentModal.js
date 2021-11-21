import types from 'redux/types';

const initialState = Object.freeze({
  open: false,
  date: null,
  doctor: null,
  schedule: null,
  patient: null,
});

export default function appointmentModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setAppointmentModal:
      return {
        ...state,
        ...payload,
        date: payload.open ? payload.date : null,
        doctor: payload.open ? payload.doctor : null,
        patient: payload.open ? payload.patient : null,
        schedule: payload.open ? payload.schedule : null,
      };
    default:
      return state;
  }
}
