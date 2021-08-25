import { get } from "./request";

/**
 * Fetch all available countries
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAllCountries(headers = null) {
  return get('/api/countries', headers);
}
