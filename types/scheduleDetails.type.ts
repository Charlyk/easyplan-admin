import { ClinicService } from 'types/clinicService.type';
import { Doctor } from 'types/doctor.type';
import { Patient } from 'types/patient.type';
import { ScheduleStatus } from 'types/scheduleStatus.type';

export interface ScheduleDetails {
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
