import { del, get, post, put } from "./request";
import imageToBase64 from "../../app/utils/imageToBase64";

/**
 * Perform login request
 * @param {{username: string, password: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function loginUser(body, headers = null) {
  return post('/api/auth/login', headers, body);
}

/**
 * Create new user account
 * @param {{
 *   firstName: string,
 *   lastName: string,
 *   username: string,
 *   password: string,
 *   phoneNumber: string,
 * }} body
 * @param {File?} avatar
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function registerUser(body, avatar, headers = null) {
  const updatedBody = { ...body };
  if (avatar != null) {
    updatedBody.avatar = await imageToBase64(avatar)
  }
  return post('/api/auth/register', headers, updatedBody)
}

/**
 * Start request password flow
 * @param {{username: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function resetUserPassword(body, headers = null) {
  return post('/api/auth/reset-password', headers, body)
}

/**
 * Request password reset
 * @param {{newPassword: string, resetToken: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestResetUserPassword(body, headers = null) {
  return put('/api/auth/reset-password', headers, body)
}

/**
 * Sign out from current user account
 * @return {Promise<AxiosResponse<*>>}
 */
export async function signOut() {
  return del('/api/auth/logout', null);
}

/**
 * Get current user info
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getCurrentUser(headers = null) {
  return get('/api/auth/me', headers);
}

/**
 * Update current user account
 * @param {Object} body
 * @param {File?} avatar
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateUserAccount(body, avatar, headers = null) {
  const updatedBody = { ...body };
  if (avatar != null) {
    updatedBody.avatar = await imageToBase64(avatar)
  }
  return put('/api/auth/update-account', headers, updatedBody);
}

/**
 * Check if user is authenticated
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCheckIsAuthenticated(headers = null) {
  return get('/api/auth/check', headers);
}
