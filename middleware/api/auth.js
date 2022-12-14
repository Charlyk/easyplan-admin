import imageToBase64 from 'app/utils/imageToBase64';
import { del, get, post, put } from './request';

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
    updatedBody.avatar = await imageToBase64(avatar);
  }
  return post('/api/auth/register', headers, updatedBody);
}

/**
 * Start request password flow
 * @param {{username: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function resetUserPassword(body, headers = null) {
  return post('/api/auth/reset-password', headers, body);
}

/**
 * Request password reset
 * @param {{newPassword: string, resetToken: string}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestResetUserPassword(body, headers = null) {
  return put('/api/auth/reset-password', headers, body);
}

/**
 * Sign out from current user account
 * @param {boolean} redirect
 * @return {Promise<AxiosResponse<*>>}
 */
export async function signOut(redirect = false) {
  return del(`/api/auth/logout?redirect=${redirect ? '1' : '0'}`, null);
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
 * @param {UpdateProfileRequest} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateUserAccount(body, headers = null) {
  return put('/api/auth/update-account', headers, body);
}

/**
 * Check if user is authenticated
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCheckIsAuthenticated(headers = null) {
  return get('/api/auth/check', headers);
}
