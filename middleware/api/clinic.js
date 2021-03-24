import { del, get, put } from "./request";

/**
 * Delete clinic invitation
 * @param {string|number} invitationId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteInvitation(invitationId, headers = null) {
  const query = new URLSearchParams({ invitationId }).toString();
  return del(`/api/clinic/invitations?${query}`, headers)
}

/**
 * Get current clinic details
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getClinicDetails(headers = null) {
  return get('/api/clinic/details', headers)
}

/**
 * Change selected clinic for user
 * @param {string|number} clinicId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function changeCurrentClinic(clinicId, headers = null) {
  const query = new URLSearchParams({ clinicId }).toString();
  return get(`/api/clinic/change?${query}`, headers)
}

/**
 * Fetch available timezones
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function clinicTimeZones(headers = null) {
  return get('/api/clinic/timezones', headers);
}

/**
 * Delete current selected clinic
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteClinic(headers = null) {
  return del('/api/clinic', headers);
}

/**
 * Update clinic data
 * @param {Object} body
 * @param {Record<string, string>|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateClinic(body, headers = null) {
  return put('/api/clinic', headers, body)
}

/**
 * Update braces settings
 * @param {Object} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateClinicBraces(body, headers = null) {
  return put('/api/clinic/braces-types', headers, body);
}
