import generateReducerActions from "../../../../../utils/generateReducerActions";

export const MenuItem = {
  personalInfo: 'personal-info',
  notes: 'notes',
  appointments: 'appointments',
  xRay: 'x-ray',
  treatmentPlan: 'treatmentPlan',
  orthodonticPlan: 'orthodonticPlan',
  generalTreatmentPlan: 'generalTreatmentPlan',
  delete: 'delete',
  debts: 'debts',
  purchases: 'purchases',
  addPayment: 'addPayment',
  messages: 'messages',
  history: 'history',
  phoneRecords: 'phoneRecords',
};

export const initialState = {
  currentMenu: MenuItem.personalInfo,
  isFetching: false,
  patient: null,
  viewInvoice: null,
};

const reducerTypes = {
  setCurrentMenu: 'setCurrentMenu',
  setIsFetching: 'setIsFetching',
  setPatient: 'setPatient',
  setViewInvoice: 'setViewInvoice',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setCurrentMenu:
      return { ...state, currentMenu: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    case reducerTypes.setViewInvoice:
      if (action.payload != null) {
        return {
          ...state,
          viewInvoice: action.payload,
          currentMenu: MenuItem.debts,
        };
      } else {
        return { ...state, viewInvoice: action.payload };
      }
    default:
      return state;
  }
};
