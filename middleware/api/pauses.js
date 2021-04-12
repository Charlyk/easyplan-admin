import { del, get, post } from "./request";

/**
 * Fetch available time for pause record
 * @param {string} date
 * @param {number|string} doctorId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchPausesAvailableTime(date, doctorId, headers = null) {
  const queryString = new URLSearchParams({ date, doctorId }).toString();
  return get(`/api/pauses/available-time?${queryString}`, headers);
}

/**
 * Post pause record
 * @param {{
 *   pauseId: number|null,
 *   doctorId: number,
 *   startTime: Date,
 *   endTime: Date,
 *   comment: string|null
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createPauseRecord(body, headers = null) {
  return post(`/api/pauses`, headers, body);
}

/**
 * Delete pause record
 * @param {number} pauseId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deletePauseRecord(pauseId, headers = null) {
  return del(`/api/pauses/${pauseId}`, headers);
}
