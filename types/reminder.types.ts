import { DealAssignee, DealContactView } from './DealView.types';

export interface ReminderType {
  id: number;
  created: string;
  lastUpdated: string;
  dueDate: string;
  endDate: string;
  type: 'Contact' | 'Meeting';
  assignee: DealAssignee;
  createdBy: DealAssignee;
  comment?: string | null;
  completed: boolean;
  resultComment?: string | null;
  active: boolean;
  deal: ReminderDeal;
  completedBy?: DealAssignee | null;
  completedAt?: string | null;
}

export interface ReminderDeal {
  id: number;
  contact: DealContactView;
  patient?: ReminderDealPatient | null;
}

export interface ReminderDealPatient {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  phoneWithCode: string;
}
