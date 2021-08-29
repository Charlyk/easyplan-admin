import { generateReducerActions } from "../../../../utils/helperFuncs";

export const initialState = {
  patient: null,
  schedule: null,
  selectedServices: [],
  showFinalizeTreatment: false,
  isFinalizing: false,
  finalServices: [],
};

const reducerTypes = {
  setPatient: 'setPatient',
  setSchedule: 'setSchedule',
  setShowFinalizeTreatment: 'setShowFinalizeTreatment',
  setIsFinalizing: 'setIsFinalizing',
  setInitialData: 'setInitialData',
};

export const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    case reducerTypes.setSchedule:
      return { ...state, schedule: action.payload };
    case reducerTypes.setShowFinalizeTreatment: {
      const { open, finalServices, selectedServices } = action.payload;
      return {
        ...state,
        showFinalizeTreatment: open,
        finalServices: finalServices ?? [],
        selectedServices: selectedServices ?? [],
      };
    }
    case reducerTypes.setIsFinalizing:
      return { ...state, isFinalizing: action.payload };
    case reducerTypes.setInitialData: {
      const { schedule } = action.payload;
      return {
        ...state,
        schedule,
        patient: schedule.patient,
      };
    }
    default:
      return state;
  }
};

export default reducer
