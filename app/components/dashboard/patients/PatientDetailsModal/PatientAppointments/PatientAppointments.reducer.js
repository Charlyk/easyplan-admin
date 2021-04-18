import { generateReducerActions } from "../../../../../../utils/helperFuncs";

export const initialState = {
  schedules: [],
  isLoading: false,
};

const reducerTypes = {
  setSchedules: 'setSchedules',
  setIsLoading: 'setIsLoading',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setSchedules:
      return { ...state, schedules: action.payload };
    default:
      return state;
  }
};
