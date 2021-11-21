import types from 'redux/types';

const initialState = Object.freeze({
  updateSchedule: null,
  deleteSchedule: null,
});

export default function schedule(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.toggleUpdateSchedule:
      return { ...state, updateSchedule: payload };
    case types.toggleDeleteSchedule:
      return { ...state, deleteSchedule: payload };
    default:
      return state;
  }
}
