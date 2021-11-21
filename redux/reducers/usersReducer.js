import types from 'redux/types';

const initialState = Object.freeze({
  updatedUser: null,
});

export default function users(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.setUpdatedUser:
      return { ...state, updatedUser: payload };
    default:
      return state;
  }
}
