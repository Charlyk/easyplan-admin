import types from '../types/types';

const initialState = Object.freeze({
  updatedUser: null,
});

export default function users(state = initialState, action) {
  switch (action.type) {
    case types.setUpdatedUser:
      return { ...state, updatedUser: action.payload };
    default:
      return state;
  }
}
