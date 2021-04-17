import { generateReducerActions } from "../../../../utils/helperFuncs";
import orderBy from "lodash/orderBy";
import moment from "moment-timezone";

export const initialState = {
  hours: [],
  schedules: [],
  filterData: {
    patientName: '',
    serviceId: 'all',
    appointmentStatus: 'all',
  }
};

const reducerTypes = {
  setHours: 'setHours',
  setSchedules: 'setSchedules',
  setFilterData: 'setFilterData',
  addSchedule: 'addSchedule',
  deleteSchedule: 'deleteSchedule',
  updateSchedule: 'updateSchedule',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setHours: {
      return { ...state, hours: action.payload };
    }
    case reducerTypes.setSchedules:
      return { ...state, schedules: action.payload };
    case reducerTypes.addSchedule: {
      const newSchedule = action.payload;
      const scheduleDate = moment(newSchedule.startTime).format('YYYY-MM-DD');
      const hasSchedules = state.schedules.some(item => item.id === scheduleDate);
      if (!hasSchedules) {
        return {
          ...state,
          schedules: [
            ...state.schedules,
            {
              id: scheduleDate,
              schedules: [newSchedule]
            },
          ]
        }
      }
      const updatedSchedules = state.schedules.map(item => {
        if (item.id !== scheduleDate) {
          return item;
        }

        const newSchedules = [...item.schedules, newSchedule]

        return {
          ...item,
          schedules: orderBy(newSchedules, ['startTime'], ['asc']),
        }
      });
      return {
        ...state,
        schedules: updatedSchedules,
      };
    }
    case reducerTypes.deleteSchedule: {
      const scheduleToDelete = action.payload;
      const scheduleDate = moment(scheduleToDelete.startTime).format('YYYY-MM-DD');
      const updatedSchedules = state.schedules.map(item => {
        if (item.id !== scheduleDate) {
          return item;
        }

        return {
          ...item,
          schedules: item.schedules.filter((schedule) =>
            schedule.id !== scheduleToDelete.id
          ),
        }
      })
      return {
        ...state,
        schedules: updatedSchedules
      }
    }
    case reducerTypes.updateSchedule: {
      const scheduleToUpdate = action.payload;
      const updatedSchedules = state.schedules.map(item => {
        const scheduleDate = moment(scheduleToUpdate.startTime)
          .format('YYYY-MM-DD');
        if (item.id !== scheduleDate) {
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
        })

        return {
          ...item,
          schedules: orderBy(newSchedules, ['startTime'], ['asc']),
        }
      })
      return {
        ...state,
        schedules: updatedSchedules
      }
    }
    default:
      return state;
  }
};
