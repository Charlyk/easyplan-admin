import { del, get, post, put } from "./request";

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
export async function updateUserCashierStatus(userId, isCashier, headers = null) {
  return put(`/api/users/${userId}/cashier`, headers, { isCashier })
}

/**
 * Accept clinic invitation
 * @param {{
 *   firstName: any,
 *   lastName: any,
 *   password: any,
 *   phoneNumber: any,
 *   invitationToken: any,
 *   avatar: any
 * }} body
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestAcceptInvitation(body, headers = null) {
  return put('/api/users/accept-invitation', headers, body);
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
