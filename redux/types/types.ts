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
} from 'types';

export interface CalendarDataState {
  schedules: ScheduleItem[];
  details: ScheduleDetails;
  dayHours: string[];
  updateSchedule?: Schedule | null;
  deleteSchedule?: Schedule | null;
  closeDetails: boolean;
  isFetchingDetails: boolean;
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
  message: string | Node | null;
  severity?: NotificationSeverity | null;
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
  checkAppointments: boolean;
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
}
