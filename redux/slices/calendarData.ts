import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { CalendarDataState } from 'redux/types';
import { ScheduleItem, ScheduleDetails, Schedule } from 'types';
import { CreateAppointmentType } from 'types/api';
import { FilterData } from '../types';

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
    requestUpdateScheduleDateAndDoctor(
      state,
      _action: PayloadAction<{
        schedule: Schedule;
        reqBody: {
          doctorId?: number;
          startDate?: string;
          cabinetId?: number;
          doctorServices?: any[];
        };
      }>,
    ) {
      state;
    },
    dispatchCreateAppointment(
      state,
      _action: PayloadAction<CreateAppointmentType>,
    ) {
      state.isLoading = true;
    },
    setSchedules(state, action: PayloadAction<ScheduleItem[]>) {
      state.isLoading = false;
      state.schedules = mapSchedules(action.payload);
    },
    setSelectedDoctor(state, action: PayloadAction<string | number>) {
      state.selectedDoctor = action.payload;
    },
    addNewSchedule(state, action: PayloadAction<Schedule>) {
      state.isLoading = false;
      const newSchedule = action.payload;
      const viewDate = moment(state.viewDate);
      const viewMode = state.viewMode;
      const scheduleDate = moment(newSchedule.startTime);
      const selectedDoctor = state.selectedDoctor;

      const weekViewCondition =
        viewMode === 'week' &&
        viewDate.isSame(scheduleDate, 'week') &&
        String(newSchedule.doctorId) === String(selectedDoctor);

      const canAddSchedule =
        weekViewCondition ||
        (viewMode === 'day' && viewDate.isSame(scheduleDate, 'date')) ||
        (viewMode === 'month' && viewDate.isSame(scheduleDate, 'month'));

      const isScheduleAlreadyAdded = state.schedules.some((scheduleGroup) =>
        scheduleGroup.schedules.some(
          (schedule) => schedule.id === newSchedule.id,
        ),
      );

      if (!canAddSchedule || isScheduleAlreadyAdded) {
        return state;
      }

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
            isDayOff: false,
            holiday: false,
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
      state.isLoading = false;
    },
    updateSchedule(state, action: PayloadAction<Schedule>) {
      state.isLoading = false;
      const scheduleToUpdate = action.payload;
      state.schedules = state.schedules.map((item) => {
        if (!isScheduleInGroup(item, scheduleToUpdate)) {
          return item;
        }

        const newSchedules = item.schedules.map((schedule) => {
          if (schedule.id !== scheduleToUpdate.id) {
            return schedule;
          }

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
      state.isLoading = false;
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
          if (schedule?.patient?.id === updatedPatient?.id) {
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
    setViewDate(state, action: PayloadAction<string>) {
      state.viewDate = action.payload;
    },
    setViewMode(state, action: PayloadAction<'day' | 'week' | 'month'>) {
      state.viewMode = action.payload;
    },
    updateFilterData(state, action: PayloadAction<FilterData>) {
      return {
        ...state,
        filterData: { ...state.filterData, ...action.payload },
      };
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
  dispatchCreateAppointment,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
  requestUpdateScheduleDateAndDoctor,
  updateSchedulePatientRecords,
  setAppointmentDetails,
  updateDetailsPatientRecords,
  setCalendarData,
  closeScheduleDetails,
  fetchScheduleDetails,
  setSchedulesData,
  setViewDate,
  setViewMode,
  updateFilterData,
  setSelectedDoctor,
} = calendarData.actions;

export default calendarData.reducer;
