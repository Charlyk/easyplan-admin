import axios from 'axios';

// const baseURL = 'https://data-nmcmweav5q-uc.a.run.app/api/';
const baseURL = 'http://localhost:8080/api/';
export const imageLambdaUrl =
  'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';

const instance = axios.create({
  baseURL,
  headers: {
    Authorization:
      'eyJhbGciOiJIUzI1NiJ9.eyJjbGluaWNJZCI6Im5vX2NsaW5pYyIsInVzZXJJZCI6IjY4ZTljNDlmLTE0NmQtM2NmZS04OGFlLWQ0ZmQ5MGFlM2MwNyJ9.hRV30BJSf6nXJSib3cMdswBrwG7l6SNaQy-y2UBgYtk',
  },
});

export default {
  /**
   * Fetch categories list from server
   * @return {Promise<{isError: boolean, message: string, data: Object|null}>}
   */
  fetchCategories: async () => {
    try {
      const response = await instance.get('categories');
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new category
   * @param {{categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  createCategory: async requestBody => {
    try {
      const response = await instance.post('categories/v1/create', requestBody);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Change category name
   * @param {{categoryId: string, categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  changeCategoryName: async requestBody => {
    try {
      const response = await instance.put(
        `categories/${requestBody.categoryId}`,
        requestBody,
      );
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Delete a category
   * @param {string} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  deleteCategory: async categoryId => {
    try {
      const response = await instance.delete(`categories/${categoryId}`);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new Service
   * @param {Object} requestBody
   * @param {string} requestBody.name
   * @param {string} requestBody.price
   * @param {string} requestBody.duration
   * @param {string} requestBody.color
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.categoryId
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null}>} requestBody.doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  createService: async requestBody => {
    try {
      const response = await instance.post('services/v1/create', requestBody);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new Service
   * @param {string} serviceId
   * @param {Object} requestBody
   * @param {string} requestBody.name
   * @param {string} requestBody.price
   * @param {string} requestBody.duration
   * @param {string} requestBody.color
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.categoryId
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null}>} requestBody.doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  editService: async (requestBody, serviceId) => {
    try {
      const response = await instance.put(
        `services/v1/${serviceId}`,
        requestBody,
      );
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Fetch a list of doctors to assign to service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchServiceDoctors: async serviceId => {
    try {
      const serviceIdParam =
        serviceId?.length > 0 ? `?serviceId=${serviceId}` : '';
      const response = await instance.get(
        `services/v1/doctors${serviceIdParam}`,
      );
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new Service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteService: async serviceId => {
    try {
      const response = await instance.delete(`services/v1/${serviceId}`);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Fetch all categories
   * @param {string|null} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>|null}>}
   */
  fetchServices: async categoryId => {
    try {
      const categoryIdParam =
        categoryId?.length > 0 ? `?categoryId=${categoryId}` : '';
      const response = await instance.get(`services${categoryIdParam}`);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Fetch all users for current clinic
   * @return {Promise<{isError: boolean, message: string|null, data: [{id: string, firstName: string|null, lastName: string|null, avatar: string|null, phoneNumber: string|null, email: string, role: string}]}|null>}
   */
  fetchUsers: async () => {
    try {
      const response = await instance.get('users');
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new user
   * @param {Object} requestBody
   * @param {string} requestBody.firstName
   * @param {string} requestBody.lastName
   * @param {string} requestBody.email
   * @param {string} requestBody.phoneNumber
   * @param {string} requestBody.avatar
   * @return {Promise<{isError: boolean, message: string}>}
   */
  createUser: async requestBody => {
    try {
      const response = await instance.post('users', requestBody);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },

  /**
   * Create new user
   * @param {string} userId
   * @param {Object} requestBody
   * @param {string} requestBody.firstName
   * @param {string} requestBody.lastName
   * @param {string} requestBody.email
   * @param {string} requestBody.phoneNumber
   * @param {string} requestBody.avatar
   * @return {Promise<{isError: boolean, message: string}>}
   */
  updateUser: async (userId, requestBody) => {
    try {
      console.log(requestBody);
      const response = await instance.put(`users/${userId}`, requestBody);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e.response.data,
      };
    }
  },

  /**
   * Remove user from current clinic
   * @param {string} userId
   * @return {Promise<{isError: boolean, message: string}>}
   */
  deleteUser: async userId => {
    try {
      const url = `users/${userId}`;
      const response = await instance.delete(url);
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e,
      };
    }
  },
};
