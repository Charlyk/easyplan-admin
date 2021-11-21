import types from 'redux/types';

export function setIsCalendarLoading(isLoading) {
  return {
    type: types.setIsCalendarLoading,
    payload: isLoading,
  };
}
