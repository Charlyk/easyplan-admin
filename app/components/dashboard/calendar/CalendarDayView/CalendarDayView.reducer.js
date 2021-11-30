import orderBy from 'lodash/orderBy';
import createContainerHours from 'app/utils/createContainerHours';
import generateReducerActions from 'app/utils/generateReducerActions';

export const initialState = {
  hours: [],
  hoursContainers: [],
  isLoading: false,
  isFetching: false,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
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
    default:
      return state;
  }
};
