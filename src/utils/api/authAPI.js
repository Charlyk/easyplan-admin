import axios from 'axios';

import { textForKey } from '../localization';
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

  /**
   * Get current user details
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  me: async () => {
    try {
      if (!authManager.isLoggedIn()) {
        return {
          isError: true,
          message: textForKey('Not logged in'),
        };
      }
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

  /**
   * Create new user account
   * @param {{firstName: string, lastName: string, avatar: string, username: string, password: string, phoneNumber: string}} requestBody
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  register: async requestBody => {
    try {
      const response = await instance().post('v1/register', requestBody);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },

  /**
   * Update current user account
   * @param {Object} requestBody
   * @param {string?} requestBody.avatar
   * @param {string?} requestBody.username
   * @param {string?} requestBody.oldPassword
   * @param {string?} requestBody.password
   * @param {string?} requestBody.firstName
   * @param {string?} requestBody.lastName
   * @return {Promise<{isError: boolean, message: string|null, data: {token: string, user: object}}>}
   */
  updateAccount: async requestBody => {
    try {
      const response = await instance().put('v1/update-account', requestBody);
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
