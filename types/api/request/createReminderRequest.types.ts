export interface CreateReminderRequest {
  date: string;
  startTime: string;
  endTime: string;
  userId: number;
  type: string;
  comment?: string | null;
  dealId: number;
  searchType: 'Deal' | 'Schedule';
}
