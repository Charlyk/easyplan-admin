import types from '../types';

const initialState = Object.freeze({ open: false, patientId: null });

export default function patientXRayModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setAddPatientXRay:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
