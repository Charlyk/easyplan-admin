import PubNub from 'pubnub';
import { ScheduleStatus } from 'types';

export type PubnubMessage = PubNub.MessageEvent & {
  message: RemoteMessage;
};

export type RemoteMessage = {
  action: MessageAction;
  payload: string;
  targetUserId: number;
};

export enum MessageAction {
  ClinicInvitationAccepted = 'ClinicInvitationAccepted',
  CreatedNewInvoice = 'CreatedNewInvoice',
  NewPatientOnSite = 'NewPatientOnSite',
  ScheduleUpdated = 'ScheduleUpdated',
  PauseUpdated = 'PauseUpdated',
  PauseCreated = 'PauseCreated',
  NewUserInvited = 'NewUserInvited',
  InvitationRemoved = 'InvitationRemoved',
  UserRemovedFromClinic = 'UserRemovedFromClinic',
  UserRestoredInClinic = 'UserRestoredInClinic',
  ClinicDataImported = 'ClinicDataImported',
  ClinicDataImportStarted = 'ClinicDataImportStarted',
  ImportingClinicServices = 'ImportingClinicServices',
  ImportingClinicDetails = 'ImportingClinicDetails',
  ImportingClinicPatients = 'ImportingClinicPatients',
  ImportingClinicSchedules = 'ImportingClinicSchedules',
  ExchangeRatesUpdated = 'ExchangeRatesUpdated',
  NewPaymentRegistered = 'NewPaymentRegistered',
  ExchangeRatesUpdateRequired = 'ExchangeRatesUpdateRequired',
  UpdateMessageStatus = 'UpdateMessageStatus',
  ScheduleDeleted = 'ScheduleDeleted',
  ScheduleCreated = 'ScheduleCreated',
  NewDealCreated = 'NewDealCreated',
  DealDataUpdated = 'DealDataUpdated',
  DealRemoved = 'DealRemoved',
  DealReminderUpdated = 'DealReminderUpdated',
  DealReminderCreated = 'DealReminderCreated',
  ReminderIsDueDate = 'ReminderIsDueDate',
  UserCalendarVisibilityChanged = 'UserCalendarVisibilityChanged',
  UserAccessBlocked = 'UserAccessBlocked',
  UserAccessRestored = 'UserAccessRestored',
  InvoiceCreated = 'InvoiceCreated',
  InvoiceUpdated = 'InvoiceUpdated',
}

export type DealPayload = {
  lastUpdated: number | string;
  sourceDescription?: string | null;
  movedToClinic?: any;
  messageSnippet?: string | null;
  deleteReason?: string | null;
  schedule?: DealSchedule | null;
  assignedTo?: DealUser | null;
  id: number;
  contact?: any;
  patient?: DealPatient | null;
  service?: DealService | null;
  created: number | string;
  state: DealState;
  source: string;
};

export type DealSchedule = {
  dateAndTime: string | number;
  canceledReason?: string | null;
  id: number;
  status: ScheduleStatus;
  endTime: string | number;
  doctor: DealUser;
  created: string | number;
};

export type DealUser = {
  firstName: string;
  lastName: string;
  id: number;
};

export type DealState = {
  deleteable: boolean;
  visibleByDefault: boolean;
  id: number;
  color: string;
  orderId: number;
  name: string;
  type: string;
};

export type DealService = {
  id: number;
  price: number;
  currency: string;
  name: string;
};

export type DealPatient = {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber: string;
  phoneWithCode: string;
  countryCode: string;
  id: number;
  tags: PatientTag[];
};

export type PatientTag = {
  id: number;
  title: string;
  clinic: TagClinic;
};

export type TagClinic = {
  id: number;
};

export type PaymentPayload = {
  id: number;
  paidAmount: number;
  totalAmount: number;
  remainedAmount: number;
  discount: number;
  services: string[];
  currency: string;
  created: string | number;
  clinicName: string;
  patientId: number;
};

export type InvoicePayload = {
  id: number;
  patient: InvoicePatient;
  doctor: InvoiceDoctor;
  schedule: InvoiceSchedule;
  status: string;
  paidAmount: number;
  totalAmount: number;
  discount: number;
  services: any[];
};

export type InvoiceSchedule = {
  id: number;
  startTime: string | number;
  endTime: string | number;
};

export type InvoiceDoctor = {
  id: number;
  name: string;
};

export type InvoicePatient = {
  id: number;
  name: string;
  discount: number;
};
