import types from 'redux/types';

const initialState = Object.freeze({
  open: false,
  patientId: null,
  mode: 'notes',
  scheduleId: null,
  visit: null,
});

export default function patientModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setAddPatientNote: {
      const { open } = payload;
      if (!open) {
        return initialState;
      }
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
}
