import { del, get } from "./request";

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
