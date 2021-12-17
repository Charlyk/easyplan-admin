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
  appData: {
    currentClinic: null,
    currentUser: null,
    authToken: null,
    isUpdatingProfile: false,
    isUpdatingClinic: false,
  },
  clinicData: {
    updateClinicData: false,
    userClinicAccessChange: null,
  },
  calendarData: {
    schedules: [],
    details: null,
    dayHours: [],
    closeDetails: false,
    isFetchingDetails: false,
  },
  appointmentModal: {
    open: false,
    doctor: null,
    date: null,
    schedule: null,
    patient: null,
    startHour: null,
    endHour: null,
    cabinet: null,
    isDoctorMode: false,
  },
  cabinetsData: {
    cabinets: [],
  },
  usersList: {
    users: [],
    invitations: [],
    isFetching: false,
    error: null,
  },
  servicesList: {
    services: [],
    details: null,
    categories: [],
    isFetching: false,
    isFetchingDetails: false,
    detailsModal: {
      open: false,
      service: null,
      category: null,
    },
    error: null,
  },
  doctorScheduleDetails: {
    schedule: null,
    scheduleId: null,
    isFetching: false,
    error: null,
  },
  globalNotifications: {
    message: null,
    severity: null,
  },
  patientList: {
    patients: {
      data: [],
      total: 0,
    },
    isLoading: false,
    isDeleting: false,
  },
  invoicesButton: {
    invoices: [],
    isLoading: false,
  },
  exchangeRates: {
    rates: [],
    isFetching: false,
  },
  crmBoard: {
    states: [],
    remindersCount: 0,
    isFetchingStates: false,
    isFetchingRemindersCount: false,
  },
  dealsColumn: {
    isFetching: false,
    showActions: false,
    isEditingName: false,
    showColorPicker: false,
    showCreateColumn: false,
    columnName: '',
    columnColor: '',
    totalElements: 0,
    page: 0,
    itemsPerPage: 25,
    items: [],
    dealState: null,
    loadedRowsMap: {},
  },
});

export default initialState;
