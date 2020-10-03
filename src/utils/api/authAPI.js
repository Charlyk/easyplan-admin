import axios from 'axios';

import authManager from '../settings/authManager';

// const baseURL = 'https://auth-nmcmweav5q-uc.a.run.app/api/authentication/';
const baseURL = 'http://localhost:8080/api/authentication/';

const instance = () => {
  let headers = null;
  if (authManager.isLoggedIn()) {
    headers = {
      Authorization: authManager.getUserToken(),
    };
  }
  return axios.create({
    baseURL,
    headers,
  });
};

export default {
  /**
   * Authenticate with the server
   * @param {string} email
   * @param {string} password
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  login: async (email, password) => {
    try {
      const response = await instance().post('v1/login', {
        username: email,
        password,
      });
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },

  me: async () => {
    try {
      const response = await instance().get('v1/me');
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },
};
