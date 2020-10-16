import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  patientId: null,
  mode: 'notes',
  scheduleId: null,
});

export default function patientModal(state = initialState, action) {
  switch (action.type) {
    case types.setAddPatientNote:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
