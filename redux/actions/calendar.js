import types from '../types/types';

export function setIsCalendarLoading(isLoading) {
  return {
    type: types.setIsCalendarLoading,
    payload: isLoading,
  };
}
