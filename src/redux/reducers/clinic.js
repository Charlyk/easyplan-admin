import types from '../types/types';

const initialState = Object.freeze({
  doctors: [],
  services: [],
  clinic: null,
});

export default function clinic(state = initialState, action) {
  switch (action.type) {
    case types.setClinicDoctors:
      return { ...state, doctors: action.payload };
    case types.setClinicServices:
      return { ...state, services: action.payload };
    case types.setClinicDetails:
      return { ...state, clinic: action.payload };
    default:
      return state;
  }
}
