import { DealAssignee, DealServiceView, DealStateView } from './DealView.types';
import { PatientTag } from './pubnubMessage.types';

export type CrmFilterType = {
  id: number;
  visibleStates: DealStateView[];
  patient: CrmFilterPatient;
  startDate?: string | null;
  endDate?: string | null;
  responsible: DealAssignee[];
  doctors: DealAssignee[];
  services: DealServiceView[];
  reminderType: ReminderTypeEnum;
  shortcut: DealShortcutType;
  patientTags: PatientTag[];
  allTags: PatientTag[];
};

export type CrmFilterOption = {
  id: string | number;
  name: string;
};

export type CrmFilterShortcut = {
  id: DealShortcutType;
  type: 'default' | 'reminder';
  name: string;
};

export type CrmFilterPatient = {
  id: number;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  label: string;
};

export enum ReminderTypeEnum {
  All = 'All',
  Today = 'Today',
  Tomorrow = 'Tomorrow',
  Week = 'Week',
  NoTasks = 'NoTasks',
  Expired = 'Expired',
}

export enum DealShortcutType {
  All = 'All',
  Opened = 'Opened',
  Mine = 'Mine',
  Success = 'Success',
  Closed = 'Closed',
  TodayTasks = 'TodayTasks',
  ExpiredTasks = 'ExpiredTasks',
}
