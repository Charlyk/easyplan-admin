import { createSelector } from 'reselect';

export const calendarSelector = (state) => state.calendar;

export const isCalendarLoadingSelector = createSelector(
  calendarSelector,
  (state) => state.isCalendarLoading,
);
