import { DealAssignee, DealView } from './DealView.types';
import { PhoneCallDirection, PhoneCallStatus } from './patientCallRecord.types';
import { ReminderType } from './reminder.types';

export interface CrmDealDetailsType {
  deal: DealView;
  messages: DealMessageView[];
  reminders: ReminderType[];
  notes: DealNoteView[];
  logs: DealLogView[];
  smsMessages: DealSmsMessageView[];
  phoneCalls: DealPhoneCallView[];
}

export type DealDetailsView = {
  id: number;
  created: string;
  lastUpdated: string;
};

export type DealMessageView = DealDetailsView & {
  source: string;
  messageDate: string;
  messageText: string;
  messageId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
};

export type DealNoteView = DealDetailsView & {
  noteText: string;
  createdBy: DealAssignee;
};

export type DealLogView = DealDetailsView & {
  user?: DealAssignee | null;
  action: DealLogAction;
  payload: string;
};

export enum DealLogAction {
  ChangeStatus = 'ChangeStatus',
  CreateSchedule = 'CreateSchedule',
  LinkPatient = 'LinkPatient',
  Remove = 'Remove',
  ChangeClinic = 'ChangeClinic',
}

export type DealSmsMessageView = {
  id: number;
  created: string;
  sentBy?: DealAssignee | null;
  message: SmsMessageData;
};

export type SmsMessageData = {
  id: number;
  messageText: string;
  sendStatus: SmsMessageSendStatus;
};

export enum SmsMessageSendStatus {
  Success = 'Success',
  Failure = 'Failure',
  Buffered = 'Buffered',
  Submit = 'Submit',
  Rejected = 'Rejected',
  Unknown = 'Unknown',
}

export type DealPhoneCallView = DealDetailsView & {
  direction: PhoneCallDirection;
  sourcePhone: string;
  targetPhone: string;
  fileUrl?: string | null;
  status: PhoneCallStatus;
  duration: number;
  callId: string;
};
