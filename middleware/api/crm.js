import { del, get, post, put } from './request';

/**
 * Fetch all available deal states for a clinic
 * @param {boolean} filter
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAllDealStates(filter, headers = null) {
  return get(`/api/crm/deal-state?filter=${filter ? 1 : 0}`, headers);
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

/**
 * Fetch deals for a state paginated
 * @param {number} stateId
 * @param {number} page
 * @param {number} itemsPerPage
 * @param {(string|null)?} filter
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchDeals(
  stateId,
  page,
  itemsPerPage,
  filter = null,
  headers = null,
) {
  const params = {
    stateId: `${stateId}`,
    page: `${page}`,
    itemsPerPage: `${itemsPerPage}`,
  };
  if (filter) {
    params.filter = filter;
  }
  const queryString = new URLSearchParams(params).toString();
  return get(`/api/crm/deals?${queryString}`, headers);
}

/**
 * Link a patient to a deal
 * @param {number} dealId
 * @param {{
 *   patientId?: number;
 *   firstName?: string;
 *   lastName?: string;
 *   phoneNumber?: string;
 *   countryCode?: string;
 *   emailAddress?: string;
 *   birthday?: string;
 * }} requestBody
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestLinkPatient(dealId, requestBody, headers = null) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return put(`/api/crm/link-patient?${queryString}`, headers, requestBody);
}

/**
 * Link a patient to a deal
 * @param {number} dealId
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestConfirmFirstContact(dealId, headers = null) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return get(`/api/crm/first-contact?${queryString}`, headers);
}

/**
 * Create a note for a deal
 * @param {number} dealId
 * @param {string} noteText
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCreateDealNote(dealId, noteText, headers = null) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return put(`/api/crm/notes?${queryString}`, headers, { noteText });
}

/**
 * Create new reminder for a deal
 * @param {number} dealId
 * @param {{
 *   date: string,
 *   startTime: string,
 *   endTime: string,
 *   userId: number,
 *   type: string,
 *   comment?: string
 * }} reminder
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCreateDealReminder(
  dealId,
  reminder,
  headers = null,
) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return put(`/api/reminders?${queryString}`, headers, reminder);
}

/**
 * Fetch all reminders for a deal
 * @param {number} dealId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchReminders(dealId, headers = null) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return get(`/api/reminders?${queryString}`, headers);
}

/**
 * Fetch all details for a deal
 * @param {number} dealId
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchDealDetails(dealId, headers = null) {
  const queryString = new URLSearchParams({ dealId: `${dealId}` }).toString();
  return get(`/api/crm/details?${queryString}`, headers);
}

/**
 * Complete a reminder for a deal
 * @param {number} reminderId
 * @param {string} resultComment
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCompleteReminder(
  reminderId,
  resultComment,
  headers = null,
) {
  return put(`/api/reminders/${reminderId}/complete`, headers, {
    resultComment,
  });
}

/**
 * Fetch active reminders count
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchRemindersCount(headers = null) {
  return get('/api/reminders/user/count', headers);
}

/**
 * Fetch user active reminders
 * @param {string} filters
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchUserReminders(filters, headers = null) {
  if (!filters) {
    return get('/api/reminders/user', headers);
  }
  return get(`/api/reminders/user?filters=${filters}`, headers);
}

/**
 * Move a deal to another column
 * @param {number} columnId
 * @param {number} dealId
 * @param {(string|null)?} deleteReason
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestChangeDealColumn(
  columnId,
  dealId,
  deleteReason = null,
  headers = null,
) {
  return put(`/api/crm/${dealId}/move`, headers, {
    newState: columnId,
    deleteReason,
  });
}

/**
 * Fetch all deal states
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchAllDealStates(headers = null) {
  return get('/api/crm/states', headers);
}

/**
 * Fetch all deal states
 * @param {{ columnId: number, visible: boolean }} body
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestUpdateDealStateVisibility(body, headers = null) {
  return put('/api/crm/states', headers, body);
}

/**
 * Move deal to another clinic
 * @param {number} dealId
 * @param {number} branchId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestChangeDealClinic(
  dealId,
  branchId,
  headers = null,
) {
  return put(`/api/crm/${dealId}/change-branch?branchId=${branchId}`, headers, {
    branchId,
  });
}
