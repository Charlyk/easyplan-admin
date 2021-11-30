import { createSlice } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import initialState from 'redux/initialState';

const calendarData = createSlice({
  name: 'calendarData',
  initialState: initialState.calendarData,
  reducers: {
    setSchedules(state, action) {
      state.schedules = action.payload.map((item) => {
        return {
          ...item,
          schedules: orderBy(
            item.schedules,
            ['rescheduled', 'startTime'],
            ['desc', 'asc'],
          ),
        };
      });
    },
    addNewSchedule(state, action) {
      const newSchedule = action.payload;
      const hasSchedules = state.schedules.some(
        (item) => item.doctorId === newSchedule.doctorId,
      );
      if (!hasSchedules) {
        return {
          ...state,
          schedules: [
            ...state.schedules,
            {
              id: newSchedule.doctorId,
              doctorId: newSchedule.doctorId,
              schedules: [newSchedule],
            },
          ],
        };
      }
      const updatedSchedules = state.schedules.map((item) => {
        if (item.doctorId !== newSchedule.doctorId) {
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
      return {
        ...state,
        schedules: updatedSchedules,
      };
    },
    updateSchedule(state, action) {
      const scheduleToUpdate = action.payload;
      const updatedSchedules = state.schedules.map((item) => {
        if (item.doctorId !== scheduleToUpdate.doctorId) return item;

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
      return {
        ...state,
        schedules: updatedSchedules,
      };
    },
    deleteSchedule(state, action) {
      const scheduleToDelete = action.payload;
      const updatedSchedules = state.schedules.map((item) => {
        if (item.doctorId !== scheduleToDelete.doctorId) return item;

        return {
          ...item,
          schedules: item.schedules.filter(
            (schedule) => schedule.id !== scheduleToDelete.id,
          ),
        };
      });
      return { ...state, schedules: updatedSchedules };
    },
    updateSchedulePatientRecords(state, action) {
      const updatedPatient = action.payload;
      const stateWithUpdatedPatients = state.schedules.map((item) => {
        const { schedules } = item;

        const updatedSchedules = schedules.map((schedule) => {
          if (schedule.patient.id === updatedPatient.id) {
            return { ...schedule, patient: { ...updatedPatient } };
          }
          return schedule;
        });

        return { ...item, schedules: updatedSchedules };
      });

      return { ...state, schedules: stateWithUpdatedPatients };
    },
    setAppointmentDetails(state, action) {
      state.details = action.payload;
    },
    updateDetailsPatientRecords(state, action) {
      const updatedPatient = action.payload;
      const newPatientObj = {
        ...state.details.patient,
        ...updatedPatient,
      };

      state.details.patient = newPatientObj;
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
