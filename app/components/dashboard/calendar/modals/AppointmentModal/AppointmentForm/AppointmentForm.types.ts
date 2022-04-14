export type AppointmentFormProps = {
  selectedDate: Date | string;
  disableSubmit?: boolean;
};

export type FormData = {
  patientId: number;
  doctorId: number;
  notes: string;
  serviceId: number;
  date: string;
  startHour: string;
  endHour: string;
  isUrgent: boolean;
  cabinetId: number;
};
