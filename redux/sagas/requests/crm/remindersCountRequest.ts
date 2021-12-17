import { AxiosResponse } from 'axios';
import { requestFetchRemindersCount as fetchRemindersCount } from 'middleware/api/crm';

export async function requestFetchRemindersCount(): Promise<
  AxiosResponse<number>
> {
  return fetchRemindersCount();
}
