import types from '../types';

export function setIsCalendarLoading(isLoading) {
  return {
    type: types.setIsCalendarLoading,
    payload: isLoading,
  };
}
