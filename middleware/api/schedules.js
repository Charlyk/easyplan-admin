import { get, post, put } from "./request";
import moment from "moment-timezone";

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

/**
 * Create or update schedule
 * @param {{
 *   patientFirstName: string|null,
 *   patientLastName: string|null,
 *   patientPhoneNumber: string|null,
 *   patientBirthday: string|null,
 *   patientEmail: string|null,
 *   patientId: number|null,
 *   doctorId: number,
 *   serviceId: number,
 *   startDate: Date,
 *   endDate: Date,
 *   note: string|null,
 *   status: string,
 *   scheduleId: number|null
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function postSchedule(body, headers = null) {
  return post(`/api/schedules`, headers, body)
}

/**
 * Fetch schedules for a month for specified doctor
 * @param {string|number} doctorId
 * @param {string} date
 * @param {'week'|'month'} period
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPeriodSchedules(doctorId, date, period, headers = null) {
  const queryString = new URLSearchParams({ doctorId, date, period }).toString();
  return get(`/api/schedules?${queryString}`, headers);
}

/**
 * Fetch schedules for a given interval of time
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getSchedulesForInterval(startDate, endDate, headers = null) {
  const queryString = new URLSearchParams({
    start: moment(startDate).format('YYYY-MM-DD'),
    end: moment(endDate).format('YYYY-MM-DD'),
  }).toString();
  return get(`/api/schedules/interval?${queryString}`, headers);
}
