import { generateReducerActions } from "../../../../utils/helperFuncs";
import { getServicesData, getScheduleDetails } from "./PatientTreatmentPlan.utils";

export const initialState = {
  isLoading: false,
  patient: null,
  toothServices: [],
  allServices: [],
  bracesServices: [],
  selectedServices: [],
  completedServices: [],
  schedule: null,
  shouldFillTreatmentPlan: null,
  treatmentPlan: null,
  showFinalizeTreatment: false,
  isFinalizing: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPatient: 'setPatient',
  setToothServices: 'setToothServices',
  setAllServices: 'setAllServices',
  setSelectedServices: 'setSelectedServices',
  setSchedule: 'setSchedule',
  setShouldFillTreatmentPlan: 'setShouldFillTreatmentPlan',
  setTreatmentPlan: 'setTreatmentPlan',
  setShowFinalizeTreatment: 'setShowFinalizeTreatment',
  setIsFinalizing: 'setIsFinalizing',
  setServices: 'setServices',
  setScheduleDetails: 'setScheduleDetails',
  setInitialData: 'setInitialData',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    case reducerTypes.setToothServices: {
      return { ...state, toothServices: action.payload };
    }
    case reducerTypes.setAllServices:
      return { ...state, allServices: action.payload };
    case reducerTypes.setSelectedServices: {
      const { services } = action.payload;
      return {
        ...state,
        selectedServices: services.map((item) => ({
          ...item,
        })),
        servicesFieldValue: '',
      };
    }
    case reducerTypes.setSchedule:
      return { ...state, schedule: action.payload };
    case reducerTypes.setShouldFillTreatmentPlan:
      return { ...state, shouldFillTreatmentPlan: action.payload };
    case reducerTypes.setShowFinalizeTreatment:
      return { ...state, showFinalizeTreatment: action.payload };
    case reducerTypes.setIsFinalizing:
      return { ...state, isFinalizing: action.payload };
    case reducerTypes.setServices: {
      return {
        ...state,
        ...getServicesData(action.payload),
      };
    }
    case reducerTypes.setScheduleDetails: {
      const { data, clinicCurrency } = action.payload;
      return {
        ...state,
        ...getScheduleDetails(data, clinicCurrency, state),
      }
    }
    case reducerTypes.setInitialData: {
      const { schedule, currency, services } = action.payload;
      return {
        ...state,
        ...getScheduleDetails(schedule, currency, state),
        ...getServicesData(services),
      };
    }
    default:
      return state;
  }
};
