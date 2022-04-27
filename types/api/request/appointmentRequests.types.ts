export type CreateAppointmentType = {
  patientId: string | number;
  doctorId: string | number;
  serviceId: string | number;
  startDate: Date | string;
  endDate: Date | string;
  isUrgent: boolean;
  status?: string | null;
  note?: string | null;
};
