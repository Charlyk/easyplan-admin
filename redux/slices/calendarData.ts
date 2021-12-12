import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { CalendarDataState } from 'redux/types';
import { ScheduleItem, ScheduleDetails, Schedule } from 'types';

const isScheduleInGroup = (group: ScheduleItem, schedule: Schedule) => {
  const scheduleDate = moment(schedule.startTime).format('YYYY-MM-DD');
  return (
    (schedule.cabinetId != null && schedule.cabinetId === group.groupId) ||
    schedule.doctorId === group.groupId ||
    scheduleDate === group.groupId
  );
};

const mapSchedules = (schedules: ScheduleItem[]) => {
  return schedules.map((item) => ({
    ...item,
    id: item.groupId,
    schedules: orderBy(
      item.schedules,
      ['rescheduled', 'startTime'],
      ['desc', 'asc'],
    ),
  }));
};

const calendarData = createSlice({
  name: 'calendarData',
  initialState: initialState.calendarData,
  reducers: {
    setSchedules(state, action: PayloadAction<ScheduleItem[]>) {
      state.schedules = mapSchedules(action.payload);
    },
    addNewSchedule(state, action: PayloadAction<Schedule>) {
      const newSchedule = action.payload;
      const hasSchedules = state.schedules.some((item) => {
        return isScheduleInGroup(item, newSchedule);
      });
      if (!hasSchedules) {
        state.schedules = [
          ...state.schedules,
          {
            id: newSchedule.cabinetId ?? newSchedule.doctorId,
            groupId: newSchedule.cabinetId ?? newSchedule.doctorId,
            schedules: [newSchedule],
          },
        ];
      } else {
        state.schedules = state.schedules.map((item) => {
          if (!isScheduleInGroup(item, newSchedule)) {
            return item;
          }

          const newSchedules = [...item.schedules, newSchedule];

          return {
            ...item,
            schedules: orderBy(
              newSchedules,
              ['rescheduled', 'startTime'],
              ['desc', 'asc'],
            ),
          };
        });
      }
    },
    updateSchedule(state, action: PayloadAction<Schedule>) {
      const scheduleToUpdate = action.payload;
      state.schedules = state.schedules.map((item) => {
        if (!isScheduleInGroup(item, scheduleToUpdate)) {
          return item;
        }

        const newSchedules = item.schedules.map((schedule) => {
          if (schedule.id !== scheduleToUpdate.id) return schedule;

          return {
            ...schedule,
            ...scheduleToUpdate,
          };
        });
        return {
          ...item,
          schedules: orderBy(
            newSchedules,
            ['rescheduled', 'startTime'],
            ['desc', 'asc'],
          ),
        };
      });
    },
    deleteSchedule(state, action: PayloadAction<Schedule>) {
      const scheduleToDelete = action.payload;
      state.schedules = state.schedules.map((item) => {
        if (!isScheduleInGroup(item, scheduleToDelete)) {
          return item;
        }

        return {
          ...item,
          schedules: item.schedules.filter(
            (schedule) => schedule.id !== scheduleToDelete.id,
          ),
        };
      });
      if (state.details != null && state.details.id === scheduleToDelete.id) {
        state.closeDetails = true;
        state.details = null;
      }
    },
    updateSchedulePatientRecords(state, action) {
      const updatedPatient = action.payload;
      state.schedules = state.schedules.map((item) => {
        const { schedules } = item;

        const updatedSchedules = schedules.map((schedule) => {
          if (schedule.patient.id === updatedPatient.id) {
            return { ...schedule, patient: { ...updatedPatient } };
          }
          return schedule;
        });

        return { ...item, schedules: updatedSchedules };
      });
    },
    setAppointmentDetails(state, action: PayloadAction<ScheduleDetails>) {
      state.details = action.payload;
      state.isFetchingDetails = false;
      if (action.payload == null) {
        state.deleteSchedule = null;
      }
    },
    updateDetailsPatientRecords(state, action) {
      const updatedPatient = action.payload;
      state.details.patient = {
        ...state.details.patient,
        ...updatedPatient,
      };
    },
    setDayHours(state, action: PayloadAction<string[]>) {
      state.dayHours = action.payload;
    },
    setCalendarData(state, action: PayloadAction<CalendarDataState>) {
      state.schedules = mapSchedules(action.payload.schedules ?? []);
      state.dayHours = action.payload.dayHours ?? [];
      state.details = action.payload.details;
    },
    closeScheduleDetails(state, action: PayloadAction<boolean>) {
      state.closeDetails = action.payload;
      if (action.payload) {
        state.details = null;
      }
    },
    fetchScheduleDetails(state, _action: PayloadAction<number>) {
      state.isFetchingDetails = true;
    },
    setSchedulesData(
      state,
      action: PayloadAction<{ schedules: ScheduleItem[]; hours: string[] }>,
    ) {
      state.schedules = mapSchedules(action.payload.schedules);
      state.dayHours = action.payload.hours;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.calendarData,
      };
    },
  },
});

export const {
  setSchedules,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
  updateSchedulePatientRecords,
  setAppointmentDetails,
  updateDetailsPatientRecords,
  setCalendarData,
  closeScheduleDetails,
  fetchScheduleDetails,
  setSchedulesData,
} = calendarData.actions;

export default calendarData.reducer;
