export interface ClinicWorkday {
  id: number;
  day: number;
  isDayOff: boolean;
  startHour?: string;
  endHour?: string;
}
