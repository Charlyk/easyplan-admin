import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const calendarDataSelector = (state: ReduxState) => state.calendarData;

export const schedulesSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.schedules,
);

export const dayHoursSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.dayHours,
);

export const updateScheduleSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.updateSchedule,
);

export const deleteScheduleSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.deleteSchedule,
);

export const calendarScheduleDetailsSelector = createSelector(
  calendarDataSelector,
  (calendarData) => calendarData.details,
);

export const calendarScheduleSelector = createSelector(
  calendarDataSelector,
  (calendarData) => calendarData.schedules,
);

export const closeDetailsSelector = createSelector(
  calendarDataSelector,
  (calendarData) => calendarData.closeDetails,
);
