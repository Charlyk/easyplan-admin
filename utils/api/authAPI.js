import Axios from 'axios';

export const baseURL = 'https://api.easyplan.pro/api/authentication'
  // env === 'dev'
  //   ? 'https://api.easyplan.pro/api/authentication'
  //   : env === 'local'
  //   ? 'http://localhost:8080/api/authentication'
  //   : 'http://localhost:8080/api/authentication';

export default {
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
  updateAccount: async (requestBody) => {
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
   * Reset user password
   * @param {Object} requestBody
   * @param {string} requestBody.newPassword
   * @param {string} requestBody.resetToken
   * @return {Promise<void>}
   */
  changeUserPassword: async (requestBody) => {
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
