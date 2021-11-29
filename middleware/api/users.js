import axios from 'axios';
import imageToBase64 from 'app/utils/imageToBase64';
import { del, get, put } from './request';

/**
 * Fetch users list
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getUsers(headers = null) {
  return get('/api/users', headers);
}

/**
 * Invite user to clinic
 * @param {{emailAddress: string, role: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function inviteUser(body, headers = null) {
  return put('/api/users/send-invitation', headers, body);
}

/**
 * Restore deleted user
 * @param {string|number} userId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function restoreUser(userId, headers = null) {
  return put(`/api/users/${userId}/restore`, headers, {});
}

/**
 * Delete a user from clinic
 * @param {string|number} userId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteUser(userId, headers = null) {
  return del(`/api/users/${userId}`, headers);
}

/**
 * Fetch details for a user
 * @param {string|number} userId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getUserDetails(userId, headers = null) {
  return get(`/api/users/${userId}`, headers);
}

/**
 * Update user account details
 * @param {string|number} userId
 * @param {Object} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateUserDetails(userId, body, headers = null) {
  return put(`/api/users/${userId}`, headers, body);
}

/**
 * Delete a holiday for a user
 * @param {string|number} userId
 * @param {string|number} holidayId
 * @param {Object} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteUserHoliday(userId, holidayId, headers = null) {
  return del(`/api/users/${userId}/holidays/${holidayId}`, headers);
}

/**
 * Update user cashier status
 * @param {number} userId
 * @param {boolean} isCashier
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateUserCashierStatus(
  userId,
  isCashier,
  headers = null,
) {
  return put(`/api/users/${userId}/cashier`, headers, { isCashier });
}

/**
 * Accept clinic invitation
 * @param {{
 *   firstName: any,
 *   lastName: any,
 *   password: any,
 *   phoneNumber: any,
 *   invitationToken: any,
 * }} body
 * @param {File} avatar
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestAcceptInvitation(body, avatar, headers = null) {
  const updatedBody = { ...body };
  if (avatar != null) {
    updatedBody.avatar = await imageToBase64(avatar);
  }
  return axios.put('/api/users/accept-invitation', updatedBody, { headers });
}

/**
 * Save user facebook auth token to server
 * @param {string} token
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function saveFacebookToken(token, headers = null) {
  return put('/api/users/integrations/facebook', headers, { token });
}

/**
 * Change user calendar visibility
 * @param {number} userId
 * @param {boolean} visible
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestToggleUserCalendarVisibility(
  userId,
  visible,
  headers = null,
) {
  return put(`/api/users/${userId}/calendar`, headers, {
    showInCalendar: visible,
  });
}

/**
 * Toggle user access to clinic
 * @param {number} userId
 * @param {boolean} accessBlocked
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestToggleUserAccessToClinic(
  userId,
  accessBlocked,
  headers = null,
) {
  return put('/api/users/toggle-access', headers, { userId, accessBlocked });
}

/**
 * Fetch current user selected charts
 * @param {*} headers
 * @return {Promise<AxiosResponse<Easyplan.ChartType[]>>}
 */
export async function requestFetchSelectedCharts(headers = null) {
  return get('/api/users/preferences/charts', headers);
}

/**
 * Update user selected charts
 * @param {ChartType[]} charts
 * @param {*} headers
 * @return {Promise<AxiosResponse<ChartType[]>>}
 */
export async function requestUpdateSelectedCharts(charts, headers = null) {
  return put('/api/users/preferences/charts', headers, { charts });
}
