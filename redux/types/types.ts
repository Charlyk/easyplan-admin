import { ScheduleDetails, ScheduleItem } from 'types';

export interface CalendarDataState {
  schedules: ScheduleItem[];
  details: ScheduleDetails;
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
  crm: CrmState;
}
