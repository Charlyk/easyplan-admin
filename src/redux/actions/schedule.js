import types from '../types/types';

export function toggleUpdateSchedule(payload) {
  return {
    type: types.toggleUpdateSchedule,
    payload,
  };
}
