import types from '../types/types';

const initialState = Object.freeze({
  updatedService: null,
});

export default function services(state = initialState, action) {
  switch (action.type) {
    case types.setUpdatedService:
      return { ...state, updatedService: action.payload };
    default:
      return state;
  }
}
