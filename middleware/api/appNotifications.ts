import { get, put } from './request';

/**
 * Fetch last unread notification
 * @param {*} headers
 * @return Promise<AxiosResponse<AppNotification | null>>
 */
export async function fetchUnreadNotification(headers = null) {
  return get('/api/app-notifications', headers);
}

/**
 * Mark a notification as read, Function will return next unread notification if there are any
 * @param {number} notificationId
 * @param {*} headers
 * @return Promise<AxiosResponse<AppNotification | null>>
 */
export async function markNotificationAsRead(
  notificationId: number,
  headers = null,
) {
  return put(`/api/app-notifications/${notificationId}`, headers, {});
}
