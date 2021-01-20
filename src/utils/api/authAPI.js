import Axios from 'axios';

import { env } from '../constants';
import { textForKey } from '../localization';
import authManager from '../settings/authManager';

const baseURL =
  env === 'dev' || env === 'local'
    ? 'https://api.easyplan.pro/api/authentication'
    : env === 'local'
    ? 'http://localhost:8080/api/authentication'
    : 'https://api.easyplan.pro/api/authentication';

export default {
  /**
   * Authenticate with the server
   * @param {string} email
   * @param {string} password
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  login: async (email, password) => {
    try {
      const response = await Axios.post(`${baseURL}/v1/login`, {
        username: email,
        password,
      });
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
  },

  requestResetPassword: async email => {
    try {
      const response = await Axios.post(`${baseURL}/v1/reset-password`, {
        username: email,
      });
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
      const response = await Axios.get(`${baseURL}/v1/me`);
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
  },

  /**
   * Create new user account
   * @param {{firstName: string, lastName: string, avatar: string, username: string, password: string, phoneNumber: string}} requestBody
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  register: async requestBody => {
    try {
      const response = await Axios.post(`${baseURL}/v1/register`, requestBody);
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
      const response = await Axios.put(
        `${baseURL}/v1/update-account`,
        requestBody,
      );
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
  },

  /**
   * Change user selected clinic
   * @param {string} clinicId
   * @return {Promise<{isError: boolean, message: string|null, data: Object}>}
   */
  changeClinic: async clinicId => {
    try {
      const response = await Axios.get(
        `${baseURL}/v1/change-clinic/${clinicId}`,
      );
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
  },

  /**
   * Reset user password
   * @param {Object} requestBody
   * @param {string} requestBody.newPassword
   * @param {string} requestBody.resetToken
   * @return {Promise<void>}
   */
  changeUserPassword: async requestBody => {
    try {
      const response = await Axios.put(
        `${baseURL}/v1/reset-password`,
        requestBody,
      );
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
  },
};
