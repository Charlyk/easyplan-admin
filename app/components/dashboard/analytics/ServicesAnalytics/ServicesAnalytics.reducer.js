import { generateReducerActions } from "../../../../../utils/helperFuncs";
import moment from "moment-timezone";

const reducerTypes = {
  setSelectedDoctor: 'setSelectedDoctor',
  setSelectedService: 'setSelectedService',
  setSelectedStatus: 'setSelectedStatus',
  setStatistics: 'setStatistics',
  setIsLoading: 'setIsLoading',
  setShowRangePicker: 'setShowRangePicker',
  setDateRange: 'setDateRange',
  setUrlParams: 'setUrlParams',
  setPage: 'setPage',
  setRowsPerPage: 'setRowsPerPage',
  setDoctors: 'setDoctors',
  setServices: 'setServices',
  setInitialQuery: 'setInitialQuery',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setSelectedStatus:
      return { ...state, selectedStatus: action.payload };
    case reducerTypes.setStatistics:
      return {
        ...state,
        statistics: action.payload.data,
        totalItems: action.payload.total,
      };
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setDateRange:
      return { ...state, dateRange: action.payload };
    case reducerTypes.setUrlParams: {
      const { doctorId, status, startDate, endDate } = action.payload;
      const fromDate = startDate
        ? moment(startDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().startOf('month').toDate();
      const toDate = endDate
        ? moment(endDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().endOf('month').toDate();
      return {
        ...state,
        selectedDoctor: { id: doctorId || -1 },
        selectedStatus: { id: status || 'All' },
        dateRange: [fromDate, toDate],
        params: action.payload,
      };
    }
    case reducerTypes.setPage:
      return { ...state, page: action.payload };
    case reducerTypes.setRowsPerPage:
      return { ...state, rowsPerPage: parseInt(action.payload), page: 0 };
    case reducerTypes.setInitialQuery:
      const { page, rowsPerPage, status, doctorId, serviceId, fromDate, toDate } = action.payload;
      return {
        ...state,
        page,
        rowsPerPage,
        selectedStatus: { id: status },
        selectedDoctor: { id: parseInt(String(doctorId || -1)) },
        selectedService: { id: parseInt(String(serviceId || -1)) },
        dateRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ],
      };
    default:
      return state;
  }
};

export const initialState = {
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  selectedStatus: { id: 'All' },
  statistics: [],
  doctors: [],
  services: [],
  isLoading: false,
  showRangePicker: false,
  urlParams: {},
  totalItems: 0,
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
  page: 0,
  rowsPerPage: 25,
};
