import moment from "moment-timezone";
import { generateReducerActions } from "../../../../../utils/helperFuncs";

export const initialState = {
  isLoading: false,
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  showRangePicker: false,
  services: [],
  doctors: [],
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
  statistics: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setSelectedDoctor: 'setSelectedDoctor',
  setSelectedService: 'setSelectedService',
  setDateRange: 'setDateRange',
  setDoctors: 'setDoctors',
  setServices: 'setServices',
  setStatistics: 'setStatistics',
  setShowRangePicker: 'setShowRangePicker',
  setInitialQuery: 'setInitialQuery',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setDateRange:
      return { ...state, dateRange: action.payload };
    case reducerTypes.setStatistics:
      return { ...state, statistics: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setInitialQuery:
      const { doctorId, serviceId, fromDate, toDate } = action.payload;
      return {
        ...state,
        selectedDoctor: { id: parseInt(doctorId) },
        selectedService: { id: parseInt(serviceId) },
        dateRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ]
      }
    default:
      return state
  }
};
