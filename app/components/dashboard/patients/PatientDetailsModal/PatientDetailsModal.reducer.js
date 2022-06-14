import { createSlice } from '@reduxjs/toolkit';

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
    name: 'personal info',
    type: 'default',
  },
  {
    id: MenuItem.purchases,
    name: 'payments',
    type: 'default',
  },
  {
    id: MenuItem.notes,
    name: 'notes',
    type: 'default',
  },
  {
    id: MenuItem.appointments,
    name: 'appointments',
    type: 'default',
  },
  {
    id: MenuItem.xRay,
    name: 'X-Ray',
    type: 'default',
  },
  {
    id: MenuItem.treatmentPlan,
    name: 'appointments notes',
    type: 'default',
  },
  {
    id: MenuItem.generalTreatmentPlan,
    name: 'treatment plan',
    type: 'default',
  },
  {
    id: MenuItem.messages,
    name: 'messages',
    type: 'default',
  },
  {
    id: MenuItem.phoneRecords,
    name: 'phone records',
    type: 'default',
  },
  {
    id: MenuItem.history,
    name: 'history of changes',
    type: 'default',
  },
  {
    id: MenuItem.delete,
    name: 'delete',
    type: 'destructive',
  },
];

export const initialState = {
  currentMenu: MenuItem.personalInfo,
  isFetching: false,
  patient: null,
  viewInvoice: null,
  avatarFile: null,
  showDeleteConfirmation: false,
  isDeleting: false,
};

const patientDetailsModalSlice = createSlice({
  name: 'patientDetailsModal',
  initialState,
  reducers: {
    setCurrentMenu(state, action) {
      state.currentMenu = action.payload;
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    },
    setPatient(state, action) {
      state.patient = action.payload;
    },
    setViewInvoice(state, action) {
      state.viewInvoice = action.payload;
      if (action.payload != null) {
        state.currentMenu = MenuItems.debts;
      }
    },
    setAvatarFile(state, action) {
      state.avatarFile = action.payload;
    },
    openDeleteConfirmation(state) {
      state.showDeleteConfirmation = true;
    },
    closeDeleteConfirmation(state) {
      state.showDeleteConfirmation = false;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
    },
  },
});

export const {
  setAvatarFile,
  setCurrentMenu,
  setViewInvoice,
  setPatient,
  setIsFetching,
  openDeleteConfirmation,
  closeDeleteConfirmation,
  setIsDeleting,
} = patientDetailsModalSlice.actions;

export default patientDetailsModalSlice.reducer;
