import { ScheduleStatus } from 'types';

export type AppointmentReportResponse = AppointmentReportUnit[];

type AppointmentReportUnit = {
  id: number;
  firstName: string;
  lastName: string;
  statuses: {
    id: ScheduleStatus;
    count: number;
  }[];
};
