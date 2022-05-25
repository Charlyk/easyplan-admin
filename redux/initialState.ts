import moment from 'moment-timezone';
import {
  reminderOptions,
  Shortcuts,
} from 'app/components/crm/CrmMain/CrmFilters/CrmFilters.constants';
import { textForKey } from 'app/utils/localization';
import { ReduxState } from 'redux/types';

const defaultRange: [string, string] = [
  moment().startOf('week').toDate().toString(),
  moment().endOf('week').toDate().toString(),
];

const initialState: ReduxState = {
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
    cookies: '',
    isUpdatingProfile: false,
    isUpdatingClinic: false,
    isAppInitialized: false,
    isEmailChanged: false,
  },
  clinicData: {
    updateClinicData: false,
    userClinicAccessChange: null,
  },
  calendarData: {
    schedules: [],
    details: null,
    dayHours: [],
    isLoading: false,
    closeDetails: false,
    isFetchingDetails: false,
    viewDate: null,
    viewMode: 'day',
    filterData: {
      searchQuery: '',
      serviceId: -1,
      appointmentStatus: 'all',
    },
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
  clinicAnalytics: {
    doctors: [],
    selectedCharts: [],
    actions: [],
    showRangePicker: false,
    selectedRange: defaultRange,
    isFetching: false,
    analytics: null,
    showActions: false,
  },
  crmBoard: {
    states: [],
    userStates: [],
    deals: [],
    dealDetails: null,
    remindersCount: 0,
    isFetchingDetails: false,
    isFetchingDeals: false,
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
  },
  patientPhoneCalls: {
    isFetching: false,
    records: [],
  },
  callToPlay: null,
  patientVisits: {
    isFetching: false,
    visits: [],
  },
  patientPurchases: {
    isLoading: false,
    payments: [],
  },
  changeLogModal: {
    open: false,
    isLoading: false,
    changes: [],
  },
  appNotification: {
    isLoading: false,
    notification: null,
  },
  clinicSettings: {
    isFetching: false,
    settings: null,
  },
  moizvonkiConnection: {
    isLoading: false,
    connection: null,
  },
  crmFilters: {
    loading: { patients: false, filter: false },
    patient: null,
    selectedDoctors: [{ id: -1, name: textForKey('All doctors') }],
    selectedServices: [{ id: -1, name: textForKey('All services') }],
    selectedUsers: [{ id: -1, name: textForKey('All users') }],
    selectedStates: [{ id: -1, name: textForKey('All states') }],
    selectedDateRange: [],
    selectedReminder: reminderOptions[0],
    selectedShortcut: Shortcuts[0],
    showRangePicker: false,
    allTags: [],
    selectedTags: [{ id: -1, name: textForKey('All tags') }],
  },
  createReminderModal: {
    open: false,
    isLoading: false,
    deal: null,
    searchType: 'Deal',
  },
  appointments: {
    modalProps: {
      open: false,
    },
    formData: {
      date: '',
      serviceId: -1,
      cabinetId: -1,
      endHour: '',
      startHour: '',
      doctorId: -1,
      isUrgent: false,
      patientId: -1,
      notes: '',
      scheduleId: null,
    },
    schedules: {
      loading: false,
      data: {
        hours: [],
        schedules: [],
      },
      error: null,
    },
    newPatientsModalOpen: false,
    selectedDate: null,
    isLoading: false,
    doctors: {
      data: [],
      error: null,
      loading: false,
    },
    services: {
      data: [],
      error: null,
      loading: false,
    },
    startHours: {
      data: [],
      error: null,
      loading: false,
    },
    endHours: {
      data: [],
      error: null,
      loading: false,
    },
  },
  patients: {
    data: { data: [], total: 0 },
    loading: false,
    error: null,
  },
  patientsAutocomplete: {
    data: [],
    loading: false,
    error: null,
  },
  paymentsState: {
    modalOpen: false,
    isDataLoading: false,
    paymentActions: {
      data: null,
      loading: false,
      error: null,
    },
    subscriptionInfo: {
      loading: false,
      error: null,
      data: {
        status: '',
        paymentStatus: '',
        id: '',
        availableSeats: 0,
        nextPayment: '',
        nextAmount: 0,
        nextCurrency: '',
        totalSeats: 0,
        interval: 'MONTH',
      },
    },
    paymentMethods: {
      loading: false,
      error: null,
      data: null,
    },
    invoicesInfo: {
      loading: false,
      error: null,
      data: null,
    },
  },
};

export default initialState;
