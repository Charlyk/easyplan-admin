import types from '../types/types';

const initialState = Object.freeze({
  updateSchedule: null,
});

export default function schedule(state = initialState, action) {
  switch (action.type) {
    case types.toggleUpdateSchedule:
      return { ...state, updateSchedule: action.payload };
    default:
      return state;
  }
}
