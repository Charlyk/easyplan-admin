import {
  Schedule,
  Patient,
  Doctor,
  ScheduleStatus,
  ClinicService,
} from 'types';

export interface ScheduleDetails extends Schedule {
  clinicId: number;
  id: number;
  service: ClinicService;
  startTime: Date;
  endTime: Date;
  scheduleStatus: ScheduleStatus;
  doctor: Doctor;
  createdBy: Doctor;
  created: Date;
  noteText: string | null;
  patient: Patient;
  canceledReason: string | null;
  isUrgent: boolean;
  delayTime: number;
}
