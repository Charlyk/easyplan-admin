import types from '../types';

const initialState = Object.freeze({
  clinic: {
    users: [],
    services: [],
    updateExchangeRates: false,
  },
});

export default function clinic(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.setClinicUsers:
      return { ...state, clinic: { ...state.clinic, users: payload } };
    case types.setClinicServices:
      return {
        ...state,
        clinic: { ...state.clinic, services: payload },
      };
    case types.setClinicDetails:
      return { clinic: payload };
    case types.setClinicExchangeRatesUpdateRequired:
      return {
        ...state,
        clinic: { ...state.clinic, updateExchangeRates: payload },
      };
    default:
      return state;
  }
}
