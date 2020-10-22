import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  patientId: null,
  mode: 'notes',
  scheduleId: null,
  visit: null,
});

export default function patientModal(state = initialState, action) {
  switch (action.type) {
    case types.setAddPatientNote: {
      const { open } = action.payload;
      if (!open) {
        return initialState;
      }
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
