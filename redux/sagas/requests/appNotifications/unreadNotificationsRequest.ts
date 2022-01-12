import { AxiosResponse } from 'axios';
import { fetchUnreadNotification } from 'middleware/api/appNotifications';
import { AppNotification } from 'types';

export async function requestFetchUnreadNotifications(): Promise<
  AxiosResponse<AppNotification | null>
> {
  return fetchUnreadNotification();
}
