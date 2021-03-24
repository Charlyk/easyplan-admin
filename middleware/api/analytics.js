import { get } from "./request";

/**
 * Get clinic general statistics
 * @param {Record<string, string>} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getGeneralStatistics(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/analytics/general?${queryString}`, headers);
}

/**
 * get clinic doctors statistics
 * @param {Record<string, string>} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getDoctorsStatistics(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/analytics/doctors?${queryString}`, headers);
}

/**
 * get clinic doctors statistics
 * @param {Record<string, string>} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getServicesStatistics(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/analytics/services?${queryString}`, headers);
}

/**
 * get clinic doctors statistics
 * @param {Record<string, string>} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getActivityJournal(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/analytics/activity-logs?${queryString}`, headers);
}
