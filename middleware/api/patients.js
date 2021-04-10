import { del, get, post, put } from "./request";

/**
 * Delete patient
 * @param {string|number} patientId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deletePatient(patientId, headers = null) {
  const query = new URLSearchParams({ patientId }).toString();
  return del(`/api/patients?${query}`, headers);
}

/**
 * Fetch all clinic patients
 * @param {Record<string, string>} query
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatients(query, headers = null) {
  const queryString = new URLSearchParams(query).toString();
  return get(`/api/patients?${queryString}`, headers);
}

/**
 * Fetch all details for a patient
 * @param {string|number} patientId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientDetails(patientId, headers = null) {
  return get(`/api/patients/${patientId}`, headers);
}

/**
 * Update note for a visit
 * @param {string|number} patientId
 * @param {string|number} visitId
 * @param {string} note
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateVisitNote(patientId, visitId, note, headers = null) {
  return put(`/api/patients/${patientId}/visits?visitId=${visitId}`, headers, { note });
}

/**
 * Create a note for a patient
 * @param {string|number} patientId
 * @param {{note: string, mode: string, scheduleId: (number|string)?}} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createPatientNote(patientId, body, headers = null) {
  return post(`/api/patients/${patientId}/notes`, headers, body);
}

/**
 * Fetch all notes for a patient
 * @param {string|number} patientId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientNotes(patientId, headers = null) {
  return get(`/api/patients/${patientId}/notes`, headers);
}

/**
 * Fetch all patient debts
 * @param {number} patientId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientDebts(patientId, headers = null) {
  return get(`/api/patients/${patientId}/debts`, headers);
}

/**
 * Search patients
 * @param {string} searchQuery
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function searchPatients(searchQuery, headers = null) {
  const queryString = new URLSearchParams({ query: searchQuery }).toString();
  return get(`/api/patients/search?${queryString}`, headers)
}
