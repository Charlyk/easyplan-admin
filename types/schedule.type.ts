import { ScheduleStatus } from 'types';

export interface Schedule {
  id: number;
  doctorId: number;
  cabinetId?: number;
  type: string;
  delayTime: number;
  scheduleStatus: ScheduleStatus;
  serviceId: number;
  serviceName: string;
  serviceColor: string;
  servicePrice: number;
  serviceCurrency: string;
  isUrgent: boolean;
  comment: string | null;
  createdByName: string;
  patient: {
    id: number;
    fullName: string;
  };
  startTime: Date;
  endTime: Date;
  rescheduled: boolean;
}

export interface ScheduleItem {
  id: number | string;
  groupId: number | string;
  schedules: Schedule[];
}
