import types from '../types/types';

const initialState = Object.freeze({
  doctors: [],
  services: [],
});

export default function clinic(state = initialState, action) {
  switch (action.type) {
    case types.setClinicDoctors:
      return { ...state, doctors: action.payload };
    case types.setClinicServices:
      return { ...state, services: action.payload };
    default:
      return state;
  }
}
