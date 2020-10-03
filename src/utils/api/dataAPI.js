import axios from 'axios';

import authManager from '../settings/authManager';

// const baseURL = 'https://data-nmcmweav5q-uc.a.run.app/api/';
const baseURL = 'http://localhost:8080/api/';
export const imageLambdaUrl =
  'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';

const instance = () =>
  axios.create({
    baseURL,
    headers: {
      Authorization: authManager.getUserToken(),
    },
  });

export default {
  /**
   * Fetch categories list from server
   * @return {Promise<{isError: boolean, message: string, data: [Object]|null}>}
   */
  fetchCategories: async () => {
    try {
      const response = await instance().get('categories');
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
   * Create new category
   * @param {{categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  createCategory: async requestBody => {
    try {
      const response = await instance().post(
        'categories/v1/create',
        requestBody,
      );
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
   * Change category name
   * @param {{categoryId: string, categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  changeCategoryName: async requestBody => {
    try {
      const response = await instance().put(
        `categories/${requestBody.categoryId}`,
        requestBody,
      );
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
   * Delete a category
   * @param {string} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  deleteCategory: async categoryId => {
    try {
      const response = await instance().delete(`categories/${categoryId}`);
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
      const response = await instance().post('services/v1/create', requestBody);
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
      const response = await instance().put(
        `services/v1/${serviceId}`,
        requestBody,
      );
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
   * Fetch a list of doctors to assign to service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchServiceDoctors: async serviceId => {
    try {
      const serviceIdParam =
        serviceId?.length > 0 ? `?serviceId=${serviceId}` : '';
      const response = await instance().get(
        `services/v1/doctors${serviceIdParam}`,
      );
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
   * Create new Service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteService: async serviceId => {
    try {
      const response = await instance().delete(`services/v1/${serviceId}`);
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
   * Fetch all categories
   * @param {string|null} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>|null}>}
   */
  fetchServices: async categoryId => {
    try {
      const categoryIdParam =
        categoryId?.length > 0 ? `?categoryId=${categoryId}` : '';
      const response = await instance().get(`services${categoryIdParam}`);
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
   * Fetch all users for current clinic
   * @return {Promise<{isError: boolean, message: string|null, data: [{id: string, firstName: string|null, lastName: string|null, avatar: string|null, phoneNumber: string|null, email: string, role: string}]}|null>}
   */
  fetchUsers: async () => {
    try {
      const response = await instance().get('users');
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
      const response = await instance().post('users', requestBody);
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
      const response = await instance().put(`users/${userId}`, requestBody);
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
      const response = await instance().delete(url);
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
   * Create new patient
   * @param {Object} requestBody
   * @param {string|null} requestBody.email
   * @param {string|null} requestBody.firstName
   * @param {string|null} requestBody.lastName
   * @param {string} requestBody.phoneNumber
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  createPatient: async requestBody => {
    try {
      const response = await instance().post('patients', requestBody);
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
   * Fetch all patients for selected clinic
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}>}
   */
  fetchAllPatients: async () => {
    try {
      const response = await instance().get('patients');
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
   * Delete patient
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null}>}
   */
  deletePatient: async patientId => {
    try {
      const response = await instance().delete(
        `patients?patientId=${patientId}`,
      );
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
   * Create new patient
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string|null} requestBody.email
   * @param {string|null} requestBody.firstName
   * @param {string|null} requestBody.lastName
   * @param {string} requestBody.phoneNumber
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  updatePatient: async (patientId, requestBody) => {
    try {
      const response = await instance().put(
        `patients/${patientId}`,
        requestBody,
      );
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
   * Create a note for patient
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string} requestBody.note
   * @return {Promise<{isError: boolean, message: string|null, data: {id: string, createdById: string, createdByName: string, noteText: string, created: string}|null}>}
   */
  createPatientNote: async (patientId, requestBody) => {
    try {
      const response = await instance().post(
        `patients/${patientId}/notes`,
        requestBody,
      );
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
   * Fetch patient notes
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>}>}
   */
  fetchPatientNotes: async patientId => {
    try {
      const response = await instance().get(`patients/${patientId}/notes`);
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
   * Add X-Ray image to patient
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string} requestBody.type
   * @param {string} requestBody.imageUrl
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  addXRayImage: async (patientId, requestBody) => {
    try {
      const response = await instance().post(
        `patients/${patientId}/x-ray`,
        requestBody,
      );
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
   * Fetch all X-Ray images for a patient
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientXRayImages: async patientId => {
    try {
      const response = await instance().get(`patients/${patientId}/x-ray`);
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
   * Fetch filters for calendar
   * @return {Promise<{isError: boolean, message: string|null, data: {doctors: [Object], services: [Object]}}>}
   */
  fetchCalendarFilters: async () => {
    try {
      const response = await instance().get(`schedules/filters`);
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
   * Search patients by phone or name
   * @param {string} query
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchPatients: async query => {
    try {
      const response = await instance().get(`patients/search?query=${query}`);
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
   * Search doctors by phone or name
   * @param {string} query
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchDoctors: async query => {
    try {
      const response = await instance().get(`users/search?query=${query}`);
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
   * Search services by name
   * @param {string} query
   * @param {string} doctorId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchServices: async (query, doctorId) => {
    try {
      const response = await instance().get(
        `services/search?query=${query}&doctorId=${doctorId}`,
      );
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
   * Create new clinic
   * @param {Object} requestBody
   * @param {string} requestBody.clinicName
   * @param {string|null} requestBody.website
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.logo
   * @param {boolean} requestBody.hasBrackets
   * @return {Promise<void>}
   */
  createClinic: async requestBody => {
    try {
      const response = await instance().post(`clinics`, requestBody);
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
