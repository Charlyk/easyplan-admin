import types from '../types/types';

const initialState = Object.freeze({ open: false, canClose: false });

export default function createClinicModal(state = initialState, action) {
  switch (action.type) {
    case types.setCreateClinic:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
