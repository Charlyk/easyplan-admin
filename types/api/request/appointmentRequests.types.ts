export type CreateAppointmentType = {
  patientId: string;
  doctorId: string | number;
  serviceId: string;
  startDate: Date | string;
  endDate: Date | string;
  isUrgent: boolean;
  status: string;
};
