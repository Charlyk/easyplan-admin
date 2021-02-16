import types from '../types/types';

export function toggleUpdateSchedule(payload) {
  return {
    type: types.toggleUpdateSchedule,
    payload,
  };
}

export function toggleDeleteSchedule(payload) {
  return {
    type: types.toggleDeleteSchedule,
    payload,
  };
}
