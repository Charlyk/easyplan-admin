import { del, get, post, put } from "./request";

/**
 * Fetch all available deal states for a clinic
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAllDealStates(headers = null) {
  return get('/api/crm/deal-state', headers);
}

/**
 * Create a new deal state for current clinic
 * @param {{
 *   name: string,
 *   orderId: number,
 *   color?: string,
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createNewDealState(body, headers = null) {
  return post('/api/crm/deal-state', headers, body);
}

/**
 * Update details for a deal state
 * @param {{
 *   name?: string|null,
 *   moveDirection?: 'Left'|'Right',
 *   color?: string|null,
 * }} body
 * @param {number} dealId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateDealState(body, dealId, headers = null) {
  return put(`/api/crm/deal-state?dealId=${dealId}`, headers, body);
}

/**
 * Delete a column
 * @param {number} dealId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteDealState(dealId, headers = null) {
  return del(`/api/crm/deal-state?dealId=${dealId}`, headers);
}
