import { AxiosResponse } from 'axios';
import { ClinicUser, CurrentUser } from '../../types';
import { put } from './request';

export async function requestAllowDoctorCreateSchedules(
  userId: number,
  headers = null,
) {
  const body = {
    canCreate: true,
  };

  return put(`/api/userPreferences/schedules/${userId}`, headers, body);
}

export async function requestForbidDoctorCreateSchedules(
  userId: number,
  headers = null,
) {
  const body = {
    canCreate: false,
  };

  return put(`/api/userPreferences/schedules/${userId}`, headers, body);
}

export async function requestChangeDoctorCalendarOrder(
  entityId: number,
  direction: 'Next' | 'Previous',
  type: 'Doctor' | 'Cabinet',
  headers?: Record<string, string> | null,
): Promise<AxiosResponse<CurrentUser>> {
  return put(
    `/api/userPreferences/calendar-order?entityId=${entityId}&type=${type}&direction=${direction}`,
    headers,
    {},
  );
}
