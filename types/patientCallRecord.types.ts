export interface PatientCallRecord {
  id: number;
  duration: number;
  status: PhoneCallStatus;
  created: string | number;
  callId: string;
  targetPhone: string;
  sourcePhone: string;
  direction: PhoneCallDirection;
  lastUpdated: string | number;
  fileUrl: string;
}

export enum PhoneCallStatus {
  Answered = 'Answered',
  NoAnswer = 'NoAnswer',
  Declined = 'Declined',
}

export enum PhoneCallDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
  Unknown = 'Unknown',
}
