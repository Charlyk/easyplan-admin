import { del, get, post, put } from "./request";

/**
 * Fetch all clinic messages
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getMessages(headers = null) {
  return get('/api/sms', headers);
}

/**
 * Delete a message
 * @param {string|number} messageId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteMessage(messageId, headers = null) {
  return del(`/api/sms/${messageId}`, headers)
}

/**
 * Update message status
 * @param {string|number} messageId
 * @param {'enable'|'disable'} status
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function toggleMessageStatus(messageId, status, headers = null) {
  const query = new URLSearchParams({ status }).toString();
  return put(`/api/sms/${messageId}?${query}`, headers, {});
}

/**
 * Create new sms message
 * @param {{
 *   messageTitle: string,
 *   messageText: string,
 *   messageType: string,
 *   messageDate: string,
 *   hour: string
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createMessage(body, headers = null) {
  return post('/api/sms', headers, body);
}

/**
 * Update a message
 * @param {string|number} messageId
 * @param {{
 *   messageTitle: string,
 *   messageText: string,
 *   messageType: string,
 *   messageDate: string,
 *   hour: string
 * }} body
 * @param {Object|null} headers
 * @return {Promise<void>}
 */
export async function updateMessage(messageId, body, headers = null) {
  return post(`/api/sms/${messageId}`, headers, body);
}

/**
 * Count how many patients will receive a message based on filter values
 * @param {{
 *   statuses: string[],
 *   categories: number[],
 *   services: number[],
 *   startDate: string,
 *   endDate: string,
 * }} body
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function countMessageRecipients(body, headers = null) {
  return post('/api/sms/count', headers, body);
}
