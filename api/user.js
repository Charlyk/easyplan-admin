import Axios from "axios";

export const baseURL = 'https://api.easyplan.pro/api/authentication'

export async function login(username, password) {
  try {
    const headers = { 'X-EasyPlan-Clinic-Id': -1 }
    const response = await Axios.post(`${baseURL}/v1/login`, {
      username,
      password,
    }, { headers });
    const { data: responseData } = response;
    if (responseData == null) {
      return {
        isError: true,
        message: 'something_went_wrong',
      };
    }
    return responseData;
  } catch (e) {
    return {
      isError: true,
      message: e.message,
    };
  }
}

/**
 * Get current user info
 * @param {{ Authorization: string, 'X-EasyPlan-Clinic-Id': number|string }} headers
 * @return {Promise<{isError: boolean, message: string, data: Object|null}>}
 */
export async function me(headers) {
  try {
    const response = await Axios.get(`${baseURL}/v1/me`, { headers });
    const { data: responseData } = response;
    if (responseData == null) {
      return {
        isError: true,
        message: 'something_went_wrong',
      };
    }
    return responseData;
  } catch (e) {
    return {
      isError: true,
      message: e.message,
    };
  }
}
