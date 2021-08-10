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

/**
 * Fetch patient phone records
 * @param {string|number} patientId
 * @param {string|number} page
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientPhoneRecords(patientId, page, headers = null) {
  const queryString = new URLSearchParams({ patientId, page }).toString();
  return get(`/api/patients/phone-records?${queryString}`, headers)
}

/**
 * Update patient personal data
 * @param {string|number} patientId
 * @param {{
 *   firstName: string,
 *   lastName: string,
 *   email: string|null,
 *   phoneNumber: string,
 *   birthday: string|null,
 *   euroDebt: number,
 *   discount: number,
 * }} requestBody
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updatePatient(patientId, requestBody, headers = null) {
  return put(`/api/patients/${patientId}`, headers, requestBody)
}

/**
 * Fetch patient history
 * @param {number} patientId
 * @param {number} page
 * @param {number} itemsPerPage
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientHistory(patientId, page, itemsPerPage, headers = null) {
  const queryString = new URLSearchParams({ page: `${page}`, itemsPerPage: `${itemsPerPage}` }).toString();
  return get(`/api/patients/${patientId}/history?${queryString}`, headers)
}

/**
 * Remove a service from patient general treatment plan
 * @param {number} patientId
 * @param {number} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deletePatientPlanService(patientId, serviceId, headers = null) {
  const queryString = new URLSearchParams({ serviceId: `${serviceId}` }).toString();
  return del(`/api/patients/${patientId}/treatment/general/service?${queryString}`, headers)
}

/**
 * Save services to patient's treatment plan
 * @param {{
 *   scheduleId: number,
 *   patientId: number,
 *   services: [{
 *     id: number,
 *     serviceId: number,
 *     toothId: string | number,
 *     completed: boolean,
 *     destination: string,
 *     isBraces: boolean,
 *     count: number,
 *     price: number,
 *     currency: string,
 *   }],
 *   paymentRequest: {
 *     paidAmount: number,
 *     discount: number,
 *     totalAmount: string,
 *     services: [{
 *       id: number,
 *       serviceId: number,
 *       count: number,
 *       price: number,
 *       currency: string,
 *     }]
 *   }?,
 * }} requestBody
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function savePatientGeneralTreatmentPlan(requestBody, headers = null) {
  return post(`/api/treatment-plans/general`, headers, requestBody)
}

/**
 * Update patient's treatment plan
 * @param {{
 *   scheduleId: number,
 *   patientId: number,
 *   services: [{
 *     id: number,
 *     serviceId: number,
 *     toothId: string | number,
 *     completed: boolean,
 *     destination: string,
 *     isBraces: boolean,
 *     count: number,
 *     price: number,
 *     currency: string
 *   }]
 * }} requestBody
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updatePatientGeneralTreatmentPlan(requestBody, headers = null) {
  return put(`/api/treatment-plans/general`, headers, requestBody)
}

/**
 * Add an image to patient x-ray files
 * @param {number} patientId
 * @param {{
 *   imageUrl: string,
     type: string,
 * }} requestBody
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function addPatientXRayImage(patientId, requestBody, headers = null) {
  return post(`/api/patients/${patientId}/x-ray`, headers, requestBody);
}

/**
 * Fetch all x-ray images for a patient
 * @param {number} patientId
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientXRayImages(patientId, headers = null) {
  return get(`/api/patients/${patientId}/x-ray`, headers);
}

/**
 * Remove a x-ray image for a patient
 * @param {number} patientId
 * @param {number} imageId
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deletePatientXRayImage(patientId, imageId, headers = null) {
  const queryString = new URLSearchParams({ imageId: `${imageId}` }).toString();
  return del(`/api/patients/${patientId}/x-ray?${queryString}`, headers);
}

/**
 * Get all visits for a patient
 * @param {number} patientId
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse>}
 */
export async function getPatientVisits(patientId, headers = null) {
  return get(`/api/patients/${patientId}/visits`, headers);
}

/**
 * Fetch all schedules for a patient
 * @param {number} patientId
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientSchedules(patientId, headers = null) {
  return get(`/api/schedules/patient-schedules/${patientId}`, headers);
}
