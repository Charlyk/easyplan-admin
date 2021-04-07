import { get, put } from "./request";
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

/**
 * Update status for a schedule
 * @param {number|string} scheduleId
 * @param {
 *  'Pending' |
 *  'Confirmed' |
 *  'WaitingForPatient' |
 *  'Late' |
 *  'DidNotCome' |
 *  'Canceled' |
 *  'OnSite' |
 *  'CompletedNotPaid' |
 *  'PartialPaid' |
 *  'CompletedPaid' |
 *  'Rescheduled' |
 *  'CompletedFree'
 * } status
 * @param {{canceledReason: string|null, newDate: Date|null}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateScheduleStatus(scheduleId, status, body, headers = null) {
  const queryString = new URLSearchParams({ scheduleId, status }).toString();
  return put(`/api/schedules/status?${queryString}`, headers, body)
}

/**
 * Fetch details for a schedule
 * @param {string|number} scheduleId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getScheduleDetails(scheduleId, headers = null) {
  const queryString = new URLSearchParams({ scheduleId }).toString();
  return get(`/api/schedules/details?${queryString}`, headers);
}

/**
 * Fetch available hours to create or edit a schedule
 * @param {{doctorId: string|number, serviceId: string|number, date: string, scheduleId: (string|number)?}} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getAvailableHours(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/schedules/available-time?${queryString}`, headers);
}
