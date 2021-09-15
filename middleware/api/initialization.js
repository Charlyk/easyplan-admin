import { get } from "./request";

/**
 * Fetch clinic details and current user
 * @param headers
 * @param date
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAppData(headers = null, date = null) {
  if (date == null) {
    return get(`/api/analytics/app-data`, headers)
  }
  return get(`/api/analytics/app-data?date=${date}`, headers)
}
