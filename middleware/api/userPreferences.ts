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
