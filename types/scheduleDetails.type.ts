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

export interface DoctorScheduleDetails {
  id: number;
  startTime: string;
  endTime: string;
  scheduleStatus: ScheduleStatus;
  patient: DoctorSchedulePatient;
  treatmentPlan: DoctorTreatmentPlan;
  invoice?: any;
}

export interface DoctorTreatmentPlan {
  id: number;
  services: any[];
  braces: any[];
}

export interface DoctorSchedulePatient {
  id: number;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
}
