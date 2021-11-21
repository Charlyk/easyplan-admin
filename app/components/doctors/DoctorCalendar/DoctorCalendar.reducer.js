import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';

import generateReducerActions from '../../../utils/generateReducerActions';

export const initialState = {
  hours: [],
  schedules: [],
  isLoading: false,
  filterData: {
    patientName: '',
    serviceId: -1,
    appointmentStatus: 'all',
  },
};

const reducerTypes = {
  setHours: 'setHours',
  setSchedules: 'setSchedules',
  setFilterData: 'setFilterData',
  addSchedule: 'addSchedule',
  deleteSchedule: 'deleteSchedule',
  updateSchedule: 'updateSchedule',
  setData: 'setData',
  setIsLoading: 'setIsLoading',
  updateFilter: 'updateFilter',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setFilterData:
      return { ...state, filterData: action.payload };
    case reducerTypes.updateFilter:
      return {
        ...state,
        filterData: {
          ...state.filterData,
          ...action.payload,
        },
      };
    case reducerTypes.setHours: {
      return { ...state, hours: action.payload };
    }
    case reducerTypes.setSchedules:
      return {
        ...state,
        schedules: action.payload.map((item) => {
          return {
            ...item,
            schedules: orderBy(
              item.schedules,
              ['rescheduled', 'startTime'],
              ['desc', 'asc'],
            ),
          };
        }),
      };
    case reducerTypes.setData:
      const { hours, schedules } = action.payload;
      return {
        ...state,
        hours,
        schedules: schedules.map((item) => {
          return {
            ...item,
            schedules: orderBy(
              item.schedules,
              ['rescheduled', 'startTime'],
              ['desc', 'asc'],
            ),
          };
        }),
      };
    case reducerTypes.addSchedule: {
      const newSchedule = action.payload;
      const scheduleDate = moment(newSchedule.startTime).format('YYYY-MM-DD');
      const hasSchedules = state.schedules.some(
        (item) => item.id === scheduleDate,
      );
      if (!hasSchedules) {
        return {
          ...state,
          schedules: [
            ...state.schedules,
            {
              id: scheduleDate,
              schedules: [newSchedule],
            },
          ],
        };
      }
      const updatedSchedules = state.schedules.map((item) => {
        if (item.id !== scheduleDate) {
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
    }
    case reducerTypes.setIsLoading: {
      return { ...state, isLoading: action.payload };
    }
    case reducerTypes.deleteSchedule: {
      const scheduleToDelete = action.payload;
      const scheduleDate = moment(scheduleToDelete.startTime).format(
        'YYYY-MM-DD',
      );
      const updatedSchedules = state.schedules.map((item) => {
        if (item.id !== scheduleDate) {
          return item;
        }

        return {
          ...item,
          schedules: item.schedules.filter(
            (schedule) => schedule.id !== scheduleToDelete.id,
          ),
        };
      });
      return {
        ...state,
        schedules: updatedSchedules,
      };
    }
    case reducerTypes.updateSchedule: {
      const scheduleToUpdate = action.payload;
      const updatedSchedules = state.schedules.map((item) => {
        const scheduleDate = moment(scheduleToUpdate.startTime).format(
          'YYYY-MM-DD',
        );
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
    }
    default:
      return state;
  }
};
