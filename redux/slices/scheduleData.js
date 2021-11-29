import { createSlice } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import initialState from 'redux/initialState';

const scheduleData = createSlice({
  name: 'scheduleData',
  initialState: initialState.scheduleData,
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
    updatePatientRecords(state, action) {
      console.log(state.schedules);
      console.log(action);
      const updatedPatient = action.payload;
      const stateWithUpdatedPatients = state.schedules.map((item) => {
        console.log(item);
        // item.schedules.map((schedule) => {
        //   if (schedule.patient.id !== updatedPatient.id) return schedule;
        //   schedule.patient = updatedPatient;
        // });
      });

      //   console.log(stateWithUpdatedPatients);

      //   return {
      //     ...state,
      //     schedules: stateWithUpdatedPatients,
      //   };
    },
  },
});

export const {
  setSchedules,
  updateSchedule,
  deleteSchedule,
  updatePatientRecords,
} = scheduleData.actions;

export default scheduleData.reducer;
