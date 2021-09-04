import moment from "moment-timezone";
import generateReducerActions from "../../../../../utils/generateReducerActions";

export const initialState = {
  doctors: [],
  selectedDoctor: { id: -1 },
  showRangePicker: false,
  selectedRange: [
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ],
};

const reducerTypes = {
  setDoctors: 'setDoctors',
  setSelectedDoctor: 'setSelectedDoctor',
  setShowRangePicker: 'setShowRangePicker',
  setSelectedRange: 'setSelectedRange',
  setInitialQuery: 'setInitialQuery',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setSelectedRange:
      return { ...state, selectedRange: action.payload };
    case reducerTypes.setInitialQuery:
      const { doctorId, fromDate, toDate } = action.payload;
      return {
        ...state,
        selectedDoctor: { id: parseInt(doctorId) },
        selectedRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ],
      };
    default:
      return state;
  }
}
