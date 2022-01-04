export interface UserCalendarOrder {
  id: number;
  entityId: number;
  entityType: 'Doctor' | 'Cabinet';
  orderId: number;
}
