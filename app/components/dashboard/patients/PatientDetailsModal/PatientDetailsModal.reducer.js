import generateReducerActions from "../../../../utils/generateReducerActions";
import { textForKey } from "../../../../utils/localization";

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

export const MenuItems = [
  {
    id: MenuItem.personalInfo,
    name: textForKey('Personal info'),
    type: 'default',
  },
  {
    id: MenuItem.purchases,
    name: textForKey('Payments'),
    type: 'default',
  },
  {
    id: MenuItem.debts,
    name: textForKey('Debts'),
    type: 'default',
  },
  {
    id: MenuItem.notes,
    name: textForKey('Notes'),
    type: 'default',
  },
  {
    id: MenuItem.appointments,
    name: textForKey('Appointments'),
    type: 'default',
  },
  {
    id: MenuItem.xRay,
    name: textForKey('X-Ray'),
    type: 'default',
  },
  {
    id: MenuItem.treatmentPlan,
    name: textForKey('Appointments notes'),
    type: 'default',
  },
  {
    id: MenuItem.orthodonticPlan,
    name: textForKey('Orthodontic plan'),
    type: 'default',
  },
  {
    id: MenuItem.generalTreatmentPlan,
    name: textForKey('Treatment plan'),
    type: 'default',
  },
  {
    id: MenuItem.messages,
    name: textForKey('Messages'),
    type: 'default',
  },
  {
    id: MenuItem.phoneRecords,
    name: textForKey('Phone records'),
    type: 'default',
  },
  {
    id: MenuItem.history,
    name: textForKey('History of changes'),
    type: 'default',
  },
  {
    id: MenuItem.delete,
    name: textForKey('Delete'),
    type: 'destructive',
  },
];

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
