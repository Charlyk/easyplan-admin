export interface DoctorCalendarOrderRequest {
  entityId: number;
  direction: 'Next' | 'Previous';
  type: 'Doctor' | 'Cabinet';
}
