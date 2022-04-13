import { ScheduleItem } from '../../schedule.type';

export type AppointmentsDoctorsResponse = {
  id: number | string;
  fullName: string;
  cabinets: AppointmentCabinet[];
};

export type AppointmentServiceResponse = {
  id: string | number;
  name: string;
  color: string;
  price: number | string;
  currency: string;
};

export type AppointmentCabinet = {
  id: string | number;
  name: string;
};

export type CalendarSchedulesResponse = {
  hours: string[];
  schedules: ScheduleItem[];
};
