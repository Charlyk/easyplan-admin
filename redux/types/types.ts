import { ClinicAnalyticsState } from 'app/components/dashboard/analytics/ClinicAnalytics/ClinicAnalytics.types';
import {
  ClinicCabinet,
  CurrentClinic,
  Schedule,
  ScheduleDetails,
  ScheduleItem,
  CurrentUser,
  Patient,
  ClinicUser,
  ClinicService,
  ClinicServiceDetails,
  ClinicServiceCategory,
  DoctorScheduleDetails,
  NotificationSeverity,
  ShortInvoice,
  ExchangeRate,
  DealView,
  DealStateView,
  PatientCallRecord,
  PatientVisit,
  AppNotification,
  ClinicSettings,
} from 'types';

export interface CalendarDataState {
  schedules: ScheduleItem[];
  details: ScheduleDetails;
  dayHours: string[];
  updateSchedule?: Schedule | null;
  deleteSchedule?: Schedule | null;
  closeDetails: boolean;
  isFetchingDetails: boolean;
  viewDate: string | null;
  viewMode: 'day' | 'week' | 'month';
  filterData: FilterData;
}

export interface FilterData {
  searchQuery?: string;
  serviceId?: number;
  appointmentStatus?: string;
}

export interface CreateAppointmentModalState {
  open: boolean;
  doctor?: any | null;
  date?: string | null;
  schedule?: Schedule | null;
  patient?: Patient | null;
  startHour?: string | null;
  endHour?: string | null;
  cabinet?: ClinicCabinet | null;
  isDoctorMode?: boolean;
}

export interface PatientSmsMessageState {
  updateMessageStatus: any;
}

export interface PatientDetailsState {
  show: boolean;
  patientId: number | null;
  onDelete: () => void;
  menuItem: any;
  smsMessages: PatientSmsMessageState;
}

export interface CrmState {
  newDeal: any;
  updatedDeal: any;
  deletedDeal: any;
  updatedReminder: any;
  newReminder: any;
}

export interface ClinicDataState {
  updateClinicData: boolean;
  userClinicAccessChange: any;
}

export interface AppDataState {
  currentClinic: CurrentClinic | null;
  currentUser: CurrentUser | null;
  authToken: string | null;
  cookies: string;
  isUpdatingProfile: boolean;
  isUpdatingClinic: boolean;
  isAppInitialized?: boolean;
}

export interface CabinetsDataState {
  cabinets: ClinicCabinet[];
}

export interface UsersListState {
  users: ClinicUser[];
  invitations: any[];
  isFetching: boolean;
  error?: string | null;
}

export interface ServiceDetailsModalState {
  open: boolean;
  service?: ClinicService | null;
  category: ClinicServiceCategory | null;
}

export interface ServicesListState {
  services: ClinicService[];
  details?: ClinicServiceDetails | null;
  detailsModal: ServiceDetailsModalState | null;
  isFetching: boolean;
  isFetchingDetails: boolean;
  error?: string | null;
  categories: any[];
}

export interface DoctorScheduleDetailsState {
  schedule: DoctorScheduleDetails | null;
  scheduleId: number | null;
  isFetching: boolean;
  error?: string | null;
}

export interface GlobalNotificationsState {
  message: string | null;
  severity?: NotificationSeverity | null;
}

export interface PatientListState {
  patients: {
    data: Patient[];
    total: number;
  };
  newPatient?: Patient | null;
  isLoading: boolean;
  isDeleting: boolean;
}

export interface InvoicesButtonState {
  invoices: ShortInvoice[];
  isLoading: boolean;
}

export interface ExchangeRatesState {
  rates: ExchangeRate[];
  isFetching: boolean;
}

export interface CrmBoardState {
  states: DealStateView[];
  remindersCount: number;
  isFetchingStates: boolean;
  isFetchingRemindersCount: boolean;
}

export interface DealsColumnState {
  isFetching: boolean;
  showActions: boolean;
  isEditingName: boolean;
  showColorPicker: boolean;
  showCreateColumn: boolean;
  columnName: string;
  columnColor: string;
  totalElements: number;
  page: number;
  itemsPerPage: number;
  items: DealView[];
  dealState: DealStateView | null;
}

export interface PatientPhoneCallsState {
  isFetching: boolean;
  records: PatientCallRecord[];
}

export interface PatientVisitsState {
  isFetching: boolean;
  visits: PatientVisit[];
}

export interface PatientPurchasesState {
  isLoading: boolean;
  payments: any[];
}

export interface ChangeLogModalState {
  isLoading: boolean;
  open: boolean;
  changes: [];
}

export interface AppNotificationState {
  isLoading: boolean;
  notification?: AppNotification | null;
}

export interface ClinicSettingsState {
  isFetching: boolean;
  settings: ClinicSettings | null;
}

export interface ReduxState {
  updateCategories: boolean;
  updateServices: boolean;
  updateUsers: boolean;
  updateXRay: boolean;
  updateNotes: boolean;
  updateCurrentUser: boolean;
  newClinicId: null;
  logout: boolean;
  forceLogout: boolean;
  user: null;
  updateAppointments: boolean;
  updateCalendarDoctorHeight: boolean;
  updateInvoices: boolean;
  checkDoctorAppointments: boolean;
  updatePatients: boolean;
  updatePatientPayments: boolean;
  isImportModalOpen: boolean;
  updateExchangeRates: boolean;
  updateDoctorAppointments: boolean;
  updateHourIndicatorTop: boolean;
  patientDetails: PatientDetailsState;
  calendarData: CalendarDataState;
  clinicData: ClinicDataState;
  appData: AppDataState;
  crm: CrmState;
  cabinetsData: CabinetsDataState;
  appointmentModal: CreateAppointmentModalState;
  usersList: UsersListState;
  servicesList: ServicesListState;
  doctorScheduleDetails: DoctorScheduleDetailsState;
  globalNotifications: GlobalNotificationsState;
  patientList: PatientListState;
  invoicesButton: InvoicesButtonState;
  exchangeRates: ExchangeRatesState;
  clinicAnalytics: ClinicAnalyticsState;
  crmBoard: CrmBoardState;
  dealsColumn: DealsColumnState;
  patientPhoneCalls: PatientPhoneCallsState;
  callToPlay: PatientCallRecord | null;
  patientVisits: PatientVisitsState;
  patientPurchases: PatientPurchasesState;
  changeLogModal: ChangeLogModalState;
  appNotification: AppNotificationState;
  clinicSettings: ClinicSettingsState;
}
