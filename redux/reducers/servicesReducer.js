import types from '../types';

const initialState = Object.freeze({
  updatedService: null,
});

export default function services(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.setUpdatedService:
      return { ...state, updatedService: payload };
    default:
      return state;
  }
}
