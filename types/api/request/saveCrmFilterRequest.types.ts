import { DealShortcutType, ReminderType } from 'types';

export interface SaveCrmFilterRequest {
  startDate?: string | null;
  endDate?: string | null;
  patientId?: number | null;
  states: number[];
  doctors: number[];
  responsible: number[];
  services: number[];
  reminder: ReminderType[];
  shortcut: DealShortcutType;
}
