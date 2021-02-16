import types from '../types/types';

const initialState = Object.freeze({
  updateSchedule: null,
  deleteSchedule: null,
});

export default function schedule(state = initialState, action) {
  switch (action.type) {
    case types.toggleUpdateSchedule:
      return { ...state, updateSchedule: action.payload };
    case types.toggleDeleteSchedule:
      return { ...state, deleteSchedule: action.payload };
    default:
      return state;
  }
}
