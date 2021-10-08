import orderBy from 'lodash/orderBy';
import generateReducerActions from "../../../../utils/generateReducerActions";
import createContainerHours from "../../../../utils/createContainerHours";

export const initialState = {
  hours: [],
  hoursContainers: [],
  isLoading: false,
  isFetching: false,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
  schedules: [],
  hasSchedules: false,
  pauseModal: {
    open: false,
    viewDate: Date(),
    doctor: null,
    startTime: null,
    endTime: null,
    id: null,
    comment: '',
  },
};

const reducerTypes = {
  setHours: 'setHours',
  setIsLoading: 'setIsLoading',
  setCreateIndicator: 'setCreateIndicator',
  setCreateIndicatorPosition: 'setCreateIndicatorPosition',
  setParentTop: 'setParentTop',
  setSchedules: 'setSchedules',
  setPauseModal: 'setPauseModal',
  setHoursContainers: 'setHoursContainers',
  setSchedulesData: 'setSchedulesData',
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
    case reducerTypes.setParentTop:
      return { ...state, parentTop: action.payload };
    case reducerTypes.setIsLoading:
      return {
        ...state,
        isLoading: action.payload,
        isFetching: action.payload,
      };
    case reducerTypes.setCreateIndicator: {
      return { ...state, createIndicator: action.payload };
    }
    case reducerTypes.setSchedules:
      return {
        ...state,
        schedules: action.payload.map(item => {
          return {
            ...item,
            schedules: orderBy(item.schedules, ['rescheduled', 'startTime'], ['desc', 'asc']),
          };
        }),
      };
    case reducerTypes.setCreateIndicatorPosition:
      return {
        ...state,
        createIndicator: { ...state.createIndicator, top: action.payload },
      };
    case reducerTypes.setPauseModal:
      return { ...state, pauseModal: action.payload };
    case reducerTypes.setHoursContainers:
      return { ...state, hoursContainers: action.payload };
    case reducerTypes.setSchedulesData: {
      const { schedules, dayHours } = action.payload;
      const updateHours = createContainerHours(dayHours);
      return {
        ...state,
        schedulesMap: schedules,
        hours: dayHours,
        hoursContainers: updateHours,
      };
    }
    case reducerTypes.addSchedule: {
      const newSchedule = action.payload;
      const hasSchedules = state.schedules.some(item => item.doctorId === newSchedule.doctorId);
      if (!hasSchedules) {
        return {
          ...state,
          schedules: [
            ...state.schedules,
            {
              id: newSchedule.doctorId,
              doctorId: newSchedule.doctorId,
              schedules: [newSchedule]
            },
          ]
        }
      }
      const updatedSchedules = state.schedules.map(item => {
        if (item.doctorId !== newSchedule.doctorId) {
          return item;
        }

        const newSchedules = [...item.schedules, newSchedule]

        return {
          ...item,
          schedules: orderBy(newSchedules, ['rescheduled', 'startTime'], ['desc', 'asc']),
        }
      });
      return {
        ...state,
        schedules: updatedSchedules,
      };
    }
    case reducerTypes.deleteSchedule: {
      const scheduleToDelete = action.payload;
      const updatedSchedules = state.schedules.map(item => {
        if (item.doctorId !== scheduleToDelete.doctorId) {
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
        if (item.doctorId !== scheduleToUpdate.doctorId) {
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
          schedules: orderBy(newSchedules, ['rescheduled', 'startTime'], ['desc', 'asc']),
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
