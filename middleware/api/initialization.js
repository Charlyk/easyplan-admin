import axios from 'axios';
import { baseApiUrl } from 'eas.config';

/**
 * Fetch clinic details and current user
 * @param headers
 * @param date
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchAppData(headers = null, date = null) {
  try {
    if (date == null) {
      return axios.get(`${baseApiUrl}/app/app-data`, {
        headers,
      });
    }
    return axios.get(`${baseApiUrl}/app/app-data?date=${date}`, {
      headers,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
