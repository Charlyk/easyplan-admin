import axios from 'axios';
import imageToBase64 from 'app/utils/imageToBase64';
import { del, get, put, post } from './request';

/**
 * Delete clinic invitation
 * @param {string|number} invitationId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteInvitation(invitationId, headers = null) {
  const query = new URLSearchParams({ invitationId }).toString();
  return del(`/api/clinic/invitations?${query}`, headers);
}

/**
 * Get current clinic details
 * @param {Object|null} headers
 * @param {string|null} date
 * @return {Promise<AxiosResponse<*>>}
 */
export async function getClinicDetails(date, headers = null) {
  if (date == null) {
    return get('/api/clinic/details', headers);
  }
  return get(`/api/clinic/details?date=${date}`, headers);
}

/**
 * Fetch available timezones
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function clinicTimeZones(headers = null) {
  return get('/api/clinic/timezones', headers);
}

/**
 * Delete current selected clinic
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function deleteClinic(headers = null) {
  return del('/api/clinic', headers);
}

/**
 * Update clinic data
 * @param {Object} body
 * @param {File?} logo
 * @param {Record<string, string>|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateClinic(body, logo, headers = null) {
  const updatedBody = { ...body };
  if (logo != null) {
    updatedBody.logo = await imageToBase64(logo);
  }
  return axios.put('/api/clinic', updatedBody, { headers });
}

/**
 * Create new clinic
 * @param {Object} body
 * @param {File} logo
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createNewClinic(body, logo, headers = null) {
  const updatedBody = { ...body };
  if (logo != null) {
    updatedBody.logo = await imageToBase64(logo);
  }
  return post('/api/clinic', headers, updatedBody);
}

/**
 * Update braces settings
 * @param {Object} body
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function updateClinicBraces(body, headers = null) {
  return put('/api/clinic/braces-types', headers, body);
}

/**
 * Fetch available currencies
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAvailableCurrencies(headers = null) {
  return get('/api/clinic/available-currencies', headers);
}

/**
 * Check if domain is available
 * @param {string} domain
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function checkDomainAvailability(domain, headers = null) {
  return get(`/api/clinic/domain?domain=${domain}`, headers);
}

/**
 * Fetch exchange rates for clinic
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchClinicExchangeRates(headers = null) {
  return get('/api/clinic/exchange-rates', headers);
}

/**
 * Update clinic exchange rates
 * @param {*} requestBody
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestUpdateExchangeRates(requestBody, headers = null) {
  return put('/api/clinic/exchange-rates', headers, requestBody);
}

/**
 * Save facebook page for current clinic
 * @param {Array<{
 *   accessToken: string,
 *   category?: string,
 *   name: string,
 *   pageId: string,
 * }>} pageData
 * @param headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function saveClinicFacebookPage(pageData, headers = null) {
  return put('/api/clinic/integrations/facebook', headers, { pages: pageData });
}

/**
 * Fetch all clinics for owner of current clinic
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchAllOwnerClinics(headers = null) {
  return get('/api/clinic/owner', headers);
}
