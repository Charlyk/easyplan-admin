import { AxiosResponse } from 'axios';
import { requestCreateDealReminder } from 'middleware/api/crm';
import { CreateReminderRequest } from 'types/api/request';
import { ReminderType } from 'types/reminder.types';

export async function requestCreateNewReminder(
  body: CreateReminderRequest,
): Promise<AxiosResponse<ReminderType>> {
  return requestCreateDealReminder(body);
}
