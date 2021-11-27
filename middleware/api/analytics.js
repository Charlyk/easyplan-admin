import { get } from './request';

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
 * Fetch clinic analytics
 * @param {string} startDate
 * @param {string} endDate
 * @param {*} headers
 * @return {Promise<AxiosResponse<Analytics>>}
 */
export async function requestFetchClinicAnalytics(
  startDate,
  endDate,
  headers = null,
) {
  const queryString = new URLSearchParams({ startDate, endDate }).toString();
  return get(`/api/analytics?${queryString}`, headers);
}
