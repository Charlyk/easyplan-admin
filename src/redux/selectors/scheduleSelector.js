import { createSelector } from 'reselect';

export const scheduleSelector = (state) => state.schedule;

export const updateScheduleSelector = createSelector(
  scheduleSelector,
  (schedule) => schedule.updateSchedule,
);

export const deleteScheduleSelector = createSelector(
  scheduleSelector,
  (schedule) => schedule.deleteSchedule,
);
