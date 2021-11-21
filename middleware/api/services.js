import axios from 'axios';
import { baseApiUrl } from 'eas.config';
import { del, get, post, put } from './request';

/**
 * Delete a service from clinic
 * @param {number|string} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteService(serviceId, headers = null) {
  return del(`/api/services/${serviceId}`, headers);
}

/**
 * Restore a deleted service
 * @param {string|number} serviceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function restoreService(serviceId, headers = null) {
  return get(`/api/services/${serviceId}`, headers);
}

/**
 * Fetch all clinic services
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAllServices(headers = null) {
  return get('/api/services', headers);
}

/**
 * Create new service
 * @param {{
 *   name: string,
 *   price: number|string,
 *   duration: number|string,
 *   color: string,
 *   doctors: {
 *     doctorId: number,
 *     doctorName: string,
 *     selected: boolean,
 *     price: number|null,
 *     percentage: number|null
 *   },
 *   categoryId: number,
 *   serviceType: 'All'|'Single'|'Braces'
 *   currency: string,
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createService(body, headers = null) {
  return post('/api/services', headers, body);
}

/**
 * Update a service
 * @param {number} serviceId
 * @param {{
 *   name: string,
 *   price: number|string,
 *   duration: number|string,
 *   color: string,
 *   doctors: {
 *     doctorId: number,
 *     doctorName: string,
 *     selected: boolean,
 *     price: number|null,
 *     percentage: number|null
 *   },
 *   categoryId: number,
 *   serviceType: 'All'|'Single'|'Braces'
 *   currency: string,
 * }} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateService(serviceId, body, headers = null) {
  return put(`/api/services/${serviceId}`, headers, body);
}

/**
 * Import services from a csv file
 * @param {File} file
 * @param {{ fieldId: string, index: number }[]} fields
 * @param {number} categoryId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function importServicesFromFile(
  file,
  fields,
  categoryId,
  headers = null,
) {
  const requestBody = new FormData();
  requestBody.append('fields', JSON.stringify(fields));
  requestBody.append('file', file, file.name);
  requestBody.append('categoryId', `${categoryId}`);
  return axios.post(`${baseApiUrl}/services/import`, requestBody, { headers });
}
