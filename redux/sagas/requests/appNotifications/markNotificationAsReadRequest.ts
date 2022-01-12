import { AxiosResponse } from 'axios';
import { markNotificationAsRead } from 'middleware/api/appNotifications';
import { AppNotification } from 'types';

export async function requestMarkNotificationAsRead(
  notificationId: number,
): Promise<AxiosResponse<AppNotification | null>> {
  return markNotificationAsRead(notificationId);
}
