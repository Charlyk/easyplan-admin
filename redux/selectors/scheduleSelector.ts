import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const calendarDataSelector = (state: ReduxState) => state.calendarData;

export const schedulesSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.schedules,
);

export const filteredSchedulesSelector = createSelector(
  calendarDataSelector,
  (calendar) => {
    const { filterData, schedules: initialSchedules } = calendar;

    const filteredSchedules = initialSchedules.map((item) => {
      const itemSchedules = item.schedules.filter((schedule) => {
        return (
          (filterData.patientName.length === 0 ||
            schedule.patient?.fullName
              .toLowerCase()
              .startsWith(filterData.patientName)) &&
          (filterData.serviceId === '-1' ||
            schedule.serviceId === parseInt(filterData.serviceId)) &&
          (filterData.appointmentStatus === 'all' ||
            schedule.scheduleStatus === filterData.appointmentStatus)
        );
      });
      return {
        ...item,
        schedules: itemSchedules,
      };
    });

    return filteredSchedules;
  },
);

export const filterDataSelector = createSelector(
  calendarDataSelector,
  (calendar) => calendar.filterData,
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

export const pauseSelector = createSelector(
  calendarDataSelector,
  (calendarData) =>
    calendarData.schedules.map((item) => {
      const filteredPauses = item.schedules.filter(
        (schedule) => schedule.type === 'Pause',
      );

      return { ...item, schedules: filteredPauses };
    }),
);
