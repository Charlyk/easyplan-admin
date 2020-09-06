import axios from 'axios';

// const baseURL = 'https://auth-nmcmweav5q-uc.a.run.app/api';
const baseURL = 'http://localhost:8080/api/';

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
};
