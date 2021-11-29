import ScheduleStatus from './scheduleStatus';

export interface ServicesStatisticResponse {
  data: ServiceStatistic[];
  total: number;
}

export interface ServiceStatistic {
  id: number;
  serviceName: string;
  patientId: number;
  dateAndTime: string;
  created: string;
  status: ScheduleStatus;
  doctor: string;
  patient: string;
  patientPhoneNumber: string;
}
