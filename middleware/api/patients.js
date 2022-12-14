import axios from 'axios';
import imageToBase64 from 'app/utils/imageToBase64';
import { baseApiUrl } from 'eas.config';
import { del, get, post, put } from './request';

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
 * Search patients by specified query
 * @param {string} query
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function searchPatients(query, headers = null) {
  const requestQuery = {
    query: query.replace(/^([+0])/, ''),
    page: '0',
    rowsPerPage: '10',
    short: '1',
  };
  return getPatients(requestQuery, headers);
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
export async function updateVisitNote(
  patientId,
  visitId,
  note,
  headers = null,
) {
  return put(`/api/visits/${visitId}`, headers, {
    note,
    patientId,
  });
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
export async function requestFetchPatientNotes(patientId, headers = null) {
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
export async function requestSearchPatients(searchQuery, headers = null) {
  const queryString = new URLSearchParams({ query: searchQuery }).toString();
  return get(`/api/patients/search?${queryString}`, headers);
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
  return get(`/api/patients/phone-records?${queryString}`, headers);
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
 *   language: string,
 *   source: string,
 *   countryCode: string,
 * }} requestBody
 * @param {File?} photo
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestUpdatePatient(
  patientId,
  requestBody,
  photo,
  headers = null,
) {
  const updatedBody = { ...requestBody };
  if (photo != null) {
    updatedBody.photo = await imageToBase64(photo);
  }
  return axios.put(`/api/patients/${patientId}`, updatedBody, { headers });
}

/**
 * Fetch patient history
 * @param {number} patientId
 * @param {number} page
 * @param {number} itemsPerPage
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getPatientHistory(
  patientId,
  page,
  itemsPerPage,
  headers = null,
) {
  const queryString = new URLSearchParams({
    page: `${page}`,
    itemsPerPage: `${itemsPerPage}`,
  }).toString();
  return get(`/api/patients/${patientId}/history?${queryString}`, headers);
}

/**
 * Remove a service from patient general treatment plan
 * @param {number} patientId
 * @param {number} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deletePatientPlanService(
  patientId,
  serviceId,
  headers = null,
) {
  const queryString = new URLSearchParams({
    serviceId: `${serviceId}`,
  }).toString();
  return del(
    `/api/patients/${patientId}/treatment/general/service?${queryString}`,
    headers,
  );
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
export async function savePatientGeneralTreatmentPlan(
  requestBody,
  headers = null,
) {
  return post('/api/treatment-plans/general', headers, requestBody);
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
export async function updatePatientGeneralTreatmentPlan(
  requestBody,
  headers = null,
) {
  return put('/api/treatment-plans/general', headers, requestBody);
}

/**
 * Fetch patient treatment plan from server
 * @param {string|number} patientId
 * @param {*} headers
 * @return {Promise<AxiosResponse<TreatmentPlan>>}
 */
export async function fetchPatientTreatmentPlan(patientId, headers = null) {
  return get(`/api/treatment-plans/${patientId}`, headers);
}

/**
 * Add an image to patient x-ray files
 * @param {number} patientId
 * @param {string} type
 * @param {File} image
 * @param {Object | null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function addPatientXRayImage(
  patientId,
  type,
  image,
  headers = null,
) {
  const formData = new FormData();
  formData.append('image', image, image.name);
  return axios.post(`${baseApiUrl}/patients/${patientId}/v2/x-ray`, formData, {
    headers,
  });
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
export async function deletePatientXRayImage(
  patientId,
  imageId,
  headers = null,
) {
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
  return get(`/api/visits?patientId=${patientId}`, headers);
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

/**
 * Import patients from a csv file
 * @param {File} file
 * @param {{ fieldId: string, index: number }[]} fields
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function importPatientsFromFile(file, fields, headers = null) {
  const requestBody = new FormData();
  requestBody.append('fields', JSON.stringify(fields));
  requestBody.append('file', file, file.name);
  return axios.post(`${baseApiUrl}/patients/import`, requestBody, { headers });
}

/**
 * Send an SMS message to patient
 * @param {string} messageText
 * @param {number} patientId
 * @param {(number|null)?} dealId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestSendSms(
  messageText,
  patientId,
  dealId = null,
  headers = null,
) {
  return post(`/api/patients/${patientId}/sms`, headers, {
    messageText,
    dealId,
  });
}

/**
 * Fetch all sms messages for a patient
 * @param {number} patientId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchSmsMessages(patientId, headers = null) {
  return get(`/api/patients/${patientId}/sms`, headers);
}

/**
 * Create new patient
 * @param {*} requestBody
 * @param {File?} photo
 * @param headers
 * @return {Promise<AxiosResponse<any>>}
 */
export async function requestCreatePatient(requestBody, photo, headers = null) {
  const updatedBody = { ...requestBody };
  if (photo != null) {
    updatedBody.photo = await imageToBase64(photo);
  }
  return axios.post('/api/patients', requestBody, { headers });
}

/**
 * Fetch all purchases for a patient
 * @param patientId
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchPatientPurchases(patientId, headers = null) {
  return get(`/api/patients/${patientId}/purchases`, headers);
}
