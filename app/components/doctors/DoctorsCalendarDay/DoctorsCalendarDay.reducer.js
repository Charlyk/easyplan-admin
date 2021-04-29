import { generateReducerActions } from "../../../../utils/helperFuncs";

export const initialState = {
  schedules: [],
  hours: [],
};

const reducerTypes = {
  setSchedules: 'setSchedules',
  updateSchedule: 'updateSchedule',
  addSchedule: 'addSchedule',
  deleteSchedule: 'deleteSchedule',
  setHours: 'setHours'
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setSchedules:
      return { ...state, schedules: action.payload };
    case reducerTypes.updateSchedule: {
      const schedules = state.schedules.map((schedule) => {
        if (schedule.id !== action.payload.id) {
          return schedule;
        }

        return {
          ...schedule,
          ...actions.payload,
        };
      });
      return { ...state, schedules };
    }
    case reducerTypes.addSchedule:
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
      };
    case reducerTypes.deleteSchedule:
      return {
        ...state,
        schedules: state.schedules.filter((item) =>
          item.id !== action.payload.id
        ),
      };
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    default:
      return state;
  }
}
