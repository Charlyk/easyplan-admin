import { del, get } from "./request";

/**
 * Delete a service from clinic
 * @param {number|string} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteService(serviceId, headers = null) {
  return del(`/api/services/${serviceId}`, headers);
}

/**
 * Restore a deleted service
 * @param {string|number} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function restoreService(serviceId, headers = null) {
  return get(`/api/services/${serviceId}`, headers);
}

/**
 * Fetch all clinic services
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAllServices(headers = null) {
  return get('/api/services', headers);
}
