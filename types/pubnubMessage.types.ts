import PubNub from 'pubnub';

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
  UserCanCreateScheduleChanged = 'UserCanCreateScheduleChanged',
}

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
