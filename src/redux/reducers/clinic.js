import types from '../types/types';

const initialState = Object.freeze({
  clinic: {
    users: [],
    services: [],
  },
});

export default function clinic(state = initialState, action) {
  switch (action.type) {
    case types.setClinicUsers:
      return { ...state, clinic: { ...state.clinic, users: action.payload } };
    case types.setClinicServices:
      return {
        ...state,
        clinic: { ...state.clinic, services: action.payload },
      };
    case types.setClinicDetails:
      return { ...state, clinic: action.payload };
    default:
      return state;
  }
}
