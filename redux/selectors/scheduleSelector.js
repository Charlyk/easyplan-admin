import { createSelector } from 'reselect';

export const scheduleSelector = (state) => state.schedule;
export const calendarDataSelector = (state) => state.calendarData;

export const updateScheduleSelector = createSelector(
  scheduleSelector,
  (schedule) => schedule.updateSchedule,
);

export const deleteScheduleSelector = createSelector(
  scheduleSelector,
  (schedule) => schedule.deleteSchedule,
);

export const calendarDetailsSelector = createSelector(
  calendarDataSelector,
  (calendarData) => calendarData.details,
);

export const calendarScheduleSelector = createSelector(
  calendarDataSelector,
  (calendarData) => calendarData.schedules,
);
