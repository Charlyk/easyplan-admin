import { generateReducerActions } from "../../../utils/helperFuncs";
import { Statuses } from "../../../utils/constants";

export const initialState = {
  details: null,
  isLoading: false,
  showStatuses: false,
  isCanceledReasonRequired: false,
  scheduleStatus: Statuses[0],
  isNewDateRequired: false
};

const reducerTypes = {
  setDetails: 'setDetails',
  setIsLoading: 'setIsLoading',
  setShowStatuses: 'setShowStatuses',
  setIsCanceledReasonRequired: 'setIsCanceledReasonRequired',
  setIsNewDateRequired: 'setIsNewDateRequired',
  setScheduleStatus: 'setScheduleStatus',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case reducerTypes.setDetails:
      return { ...state, details: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setShowStatuses:
      return { ...state, showStatuses: action.payload };
    case reducerTypes.setIsCanceledReasonRequired:
      return { ...state, isCanceledReasonRequired: action.payload };
    case reducerTypes.setScheduleStatus:
      return { ...state, scheduleStatus: action.payload };
    case reducerTypes.setIsNewDateRequired:
      return { ...state, isNewDateRequired: action.payload };
    default:
      return state;
  }
}
