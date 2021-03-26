import { get } from "./request";
import { baseAppUrl } from "../../eas.config";

/**
 * Fetch calendar day schedules
 * @param {Object} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchDaySchedules(query, headers) {
  const queryString = new URLSearchParams({ ...query, period: 'day' }).toString();
  return get(`/api/schedules?${queryString}`, headers);
}

/**
 * Fetch clinic day hours
 * @param {Object} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchSchedulesHours(query, headers = null) {
  const queryString = new URLSearchParams({ ...query, period: 'day' }).toString();
  return get(`/api/schedules/day-hours?${queryString}`, headers)
}

/**
 * Fetch doctor schedule details
 * @param {string|number|null} scheduleId
 * @param {string|number|null} patientId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchDoctorScheduleDetails(scheduleId, patientId, headers = null) {
  let query = { scheduleId: '-1' };
  if (scheduleId != null) {
    query = { scheduleId };
  } else if (patientId != null) {
    query = { patientId };
  }
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/schedules/doctor-details?${queryString}`, headers);
}

/**
 * Fetch schedule info for confirmation
 * @param {number|string} scheduleId
 * @param {number|string} patientId
 * @param {Object|null} headers
 * @return {Promise<void>}
 */
export async function fetchScheduleConfirmationInfo(scheduleId, patientId, headers = null) {
  const queryString = new URLSearchParams({ scheduleId, patientId }).toString();
  return get(`/api/schedules/confirm?${queryString}`, headers)
}
