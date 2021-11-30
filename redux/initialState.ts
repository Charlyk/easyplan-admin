import { ReduxState } from 'redux/types';

const initialState: ReduxState = Object.freeze({
  updateCategories: false,
  updateServices: false,
  updateUsers: false,
  updateXRay: false,
  updateNotes: false,
  updateCurrentUser: false,
  newClinicId: null,
  logout: false,
  forceLogout: false,
  user: null,
  updateAppointments: false,
  updateCalendarDoctorHeight: false,
  checkAppointments: false,
  updateInvoices: false,
  checkDoctorAppointments: false,
  patientDetails: {
    show: false,
    patientId: null,
    onDelete: null,
    menuItem: null,
    smsMessages: {
      updateMessageStatus: null,
    },
  },
  updatePatients: false,
  updatePatientPayments: false,
  isImportModalOpen: false,
  updateExchangeRates: false,
  updateDoctorAppointments: false,
  updateHourIndicatorTop: false,
  crm: {
    newDeal: null,
    updatedDeal: null,
    deletedDeal: null,
    updatedReminder: null,
    newReminder: null,
  },
  clinicData: {
    updateClinicData: false,
    userClinicAccessChange: null,
  },
  calendarData: {
    schedules: [],
    details: null,
  },
});

export default initialState;
