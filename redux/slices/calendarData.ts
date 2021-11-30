import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { ScheduleItem, ScheduleDetails, Schedule } from 'types';
import initialState from '../initialState';

const calendarData = createSlice({
  name: 'calendarData',
  initialState: initialState.calendarData,
  reducers: {
    setSchedules(state, action: PayloadAction<ScheduleItem[]>) {
      state.schedules = action.payload.map((item) => ({
        ...item,
        schedules: orderBy(
          item.schedules,
          ['rescheduled', 'startTime'],
          ['desc', 'asc'],
        ),
      }));
    },
    addNewSchedule(state, action: PayloadAction<Schedule>) {
      const newSchedule = action.payload;
      const hasSchedules = state.schedules.some(
        (item) =>
          item.groupId === newSchedule.doctorId ||
          item.groupId === newSchedule.cabinetId,
      );
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
          if (
            item.groupId !== newSchedule.doctorId &&
            item.groupId !== newSchedule.cabinetId
          ) {
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
        if (
          item.groupId !== scheduleToUpdate.doctorId &&
          item.groupId !== scheduleToUpdate.cabinetId
        ) {
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
      console.log(state);
      state.schedules = state.schedules.map((item) => {
        if (item.groupId !== scheduleToDelete.doctorId) return item;

        return {
          ...item,
          schedules: item.schedules.filter(
            (schedule) => schedule.id !== scheduleToDelete.id,
          ),
        };
      });
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
    },
    updateDetailsPatientRecords(state, action) {
      const updatedPatient = action.payload;
      state.details.patient = {
        ...state.details.patient,
        ...updatedPatient,
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
} = calendarData.actions;

export default calendarData.reducer;
