import types from '../types/types';

const initialState = Object.freeze({ open: false, patientId: null });

export default function patientXRayModal(state = initialState, action) {
  switch (action.type) {
    case types.setAddPatientXRay:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
