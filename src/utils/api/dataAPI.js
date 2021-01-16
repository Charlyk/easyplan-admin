import Axios from 'axios';
import moment from 'moment';

import { env } from '../constants';
import authManager from '../settings/authManager';

const baseURL =
  env === 'dev'
    ? 'https://api.easyplan.pro/api'
    : env === 'local'
    ? 'http://localhost:8080/api'
    : 'https://api.easyplan.pro/api';
export const imageLambdaUrl =
  'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';

export default {
  /**
   * Fetch categories list from server
   * @return {Promise<{isError: boolean, message: string, data: [Object]|null}>}
   */
  fetchCategories: async () => {
    try {
      const response = await Axios.get(`${baseURL}/categories`);
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
   * Create new category
   * @param {{categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  createCategory: async requestBody => {
    try {
      const response = await Axios.post(
        `${baseURL}/categories/v1/create`,
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
   * Change category name
   * @param {{categoryId: string, categoryName: string}} requestBody
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  changeCategoryName: async requestBody => {
    try {
      const response = await Axios.put(
        `${baseURL}/categories/${requestBody.categoryId}`,
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
   * Delete a category
   * @param {string} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Object|null}>}
   */
  deleteCategory: async categoryId => {
    try {
      const response = await Axios.delete(
        `${baseURL}/categories/${categoryId}`,
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
   * Create new Service
   * @param {Object} requestBody
   * @param {string} requestBody.name
   * @param {string} requestBody.price
   * @param {string} requestBody.duration
   * @param {string} requestBody.color
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.categoryId
   * @param {string} requestBody.serviceType
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null, selected: boolean}>} requestBody.doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  createService: async requestBody => {
    try {
      const response = await Axios.post(
        `${baseURL}/services/v1/create`,
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
   * Create new Service
   * @param {string} serviceId
   * @param {Object} requestBody
   * @param {string} requestBody.name
   * @param {string} requestBody.price
   * @param {string} requestBody.duration
   * @param {string} requestBody.color
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.categoryId
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null, selected: boolean}>} requestBody.doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  editService: async (requestBody, serviceId) => {
    try {
      const response = await Axios.put(
        `${baseURL}/services/v1/${serviceId}`,
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
   * Fetch a list of doctors to assign to service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchServiceDoctors: async serviceId => {
    try {
      const serviceIdParam =
        serviceId?.length > 0 ? `?serviceId=${serviceId}` : '';
      const response = await Axios.get(
        `${baseURL}/services/v1/doctors${serviceIdParam}`,
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
   * Create new Service
   * @param {string} serviceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteService: async serviceId => {
    try {
      const response = await Axios.delete(
        `${baseURL}/services/v1/${serviceId}`,
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

  restoreService: async serviceId => {
    try {
      const response = await Axios.get(
        `${baseURL}/services/v1/${serviceId}/restore`,
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
   * Fetch all categories
   * @param {string|null} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>|null}>}
   */
  fetchServices: async categoryId => {
    try {
      const categoryIdParam =
        categoryId?.length > 0 ? `?categoryId=${categoryId}` : '';
      const response = await Axios.get(`${baseURL}/services${categoryIdParam}`);
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
   * Fetch all users for current clinic
   * @return {Promise<{isError: boolean, message: string|null, data: { users: object[], invitations: object[] }|null}>}
   */
  fetchUsers: async () => {
    try {
      const response = await Axios.get(`${baseURL}/users`);
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
      const response = await Axios.post(`${baseURL}/users`, requestBody);
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
   * Create new user
   * @param {number} userId
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
      const response = await Axios.put(
        `${baseURL}/users/${userId}`,
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
      const url = `${baseURL}/users/${userId}`;
      const response = await Axios.delete(url);
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
   * Remove user from current clinic
   * @param {string} userId
   * @return {Promise<{isError: boolean, message: string}>}
   */
  restoreUser: async userId => {
    try {
      const url = `${baseURL}/users/${userId}/restore`;
      const response = await Axios.put(url);
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
      const response = await Axios.post(`${baseURL}/patients`, requestBody);
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
   * Fetch all patients for selected clinic
   * @return {Promise<{isError: boolean, message: string|null, data: { total: number, data: [Object]}}>}
   */
  fetchAllPatients: async (page, itemsPerPage, searchQuery) => {
    try {
      let url = `${baseURL}/patients?page=${page}&itemsPerPage=${itemsPerPage}`;
      if (searchQuery?.length > 0) {
        url = `${url}&query=${searchQuery}`;
      }
      const response = await Axios.get(url);
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
   * Delete patient
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null}>}
   */
  deletePatient: async patientId => {
    try {
      const response = await Axios.delete(
        `${baseURL}/patients?patientId=${patientId}`,
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
      const response = await Axios.put(
        `${baseURL}/patients/${patientId}`,
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
   * Create a note for patient
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string} requestBody.note
   * @param {'notes'|'appointments'} requestBody.mode
   * @param {string?} requestBody.scheduleId
   * @return {Promise<{isError: boolean, message: string|null, data: {id: string, createdById: string, createdByName: string, noteText: string, created: string}|null}>}
   */
  createPatientNote: async (patientId, requestBody) => {
    try {
      const response = await Axios.post(
        `${baseURL}/patients/${patientId}/notes`,
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
   * Fetch patient notes
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>}>}
   */
  fetchPatientNotes: async patientId => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/${patientId}/notes`,
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
   * Fetch patient appointments notes
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>}>}
   */
  fetchPatientAppointmentsNotes: async patientId => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/${patientId}/appointments-notes`,
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
   * Add X-Ray image to patient
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string} requestBody.type
   * @param {string} requestBody.imageUrl
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  addXRayImage: async (patientId, requestBody) => {
    try {
      const response = await Axios.post(
        `${baseURL}/patients/${patientId}/x-ray`,
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
   * Fetch all X-Ray images for a patient
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientXRayImages: async patientId => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/${patientId}/x-ray`,
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
   * Fetch filters for calendar
   * @return {Promise<{isError: boolean, message: string|null, data: {doctors: [Object], components: [Object]}}>}
   */
  fetchCalendarFilters: async () => {
    try {
      const response = await Axios.get(`${baseURL}/schedules/filters`);
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
   * Search patients by phone or name
   * @param {string} query
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchPatients: async query => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/search?query=${query}`,
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
   * Search doctors by phone or name
   * @param {string} query
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchDoctors: async query => {
    try {
      const response = await Axios.get(
        `${baseURL}/users/search?query=${query}`,
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
   * Search components by name
   * @param {string} query
   * @param {string} doctorId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchServices: async (query, doctorId) => {
    try {
      const response = await Axios.get(
        `${baseURL}/services/search?query=${query}&doctorId=${doctorId}`,
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
      const response = await Axios.post(`${baseURL}/clinics`, requestBody);
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
   * Update clinic details
   * @param {Object} requestBody
   * @param {string} requestBody.id
   * @param {string} requestBody.clinicName
   * @param {string|null} requestBody.email
   * @param {string|null} requestBody.phoneNumber
   * @param {string|null} requestBody.telegramNumber
   * @param {string|null} requestBody.viberNumber
   * @param {string|null} requestBody.whatsappNumber
   * @param {string|null} requestBody.website
   * @param {string} requestBody.currency
   * @param {string} requestBody.country
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.logoUrl
   * @param {Array.<{day: number, startHour: string, endHour: string, isDayOff: boolean}>} requestBody.workDays
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  updateClinic: async requestBody => {
    try {
      const response = await Axios.put(`${baseURL}/clinics`, requestBody);
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
   * Fetch selected clinic details
   * @return {Promise<{isError: boolean, message: string|null, data: Object}>}
   */
  fetchClinicDetails: async () => {
    try {
      const response = await Axios.get(`${baseURL}/clinics/details`);
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
   * Fetch current user services
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}>}
   */
  fetchUserServices: async () => {
    try {
      const response = await Axios.get(`${baseURL}/services/v1/user-services`);
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
   * Fetch available hours for a doctor
   * @param {string?} scheduleId
   * @param {string} doctorId
   * @param {string} serviceId
   * @param {Date} date
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchAvailableTime: async (scheduleId, doctorId, serviceId, date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      let url = `${baseURL}/schedules/available-time?doctorId=${doctorId}&serviceId=${serviceId}&date=${stringDate}`;
      if (scheduleId?.length > 0) {
        url += `&scheduleId=${scheduleId}`;
      }
      const response = await Axios.get(url);
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
   * Accept invitation to a clinic
   * @param {{ firstName: string, lastName: string, password: string, phoneNumber: string, invitationToken: string }} requestBody
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  acceptClinicInvitation: async requestBody => {
    try {
      const response = await Axios.put(
        `${baseURL}/users/accept-invitation`,
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
   * Create new schedule
   * @param {Object} requestBody
   * @param {string?} requestBody.patientFirstName
   * @param {string?} requestBody.patientLastName
   * @param {string?} requestBody.patientPhoneNumber
   * @param {string?} requestBody.patientId
   * @param {string?} requestBody.patientFirstName
   * @param {string?} requestBody.patientLastName
   * @param {string?} requestBody.patientPhoneNumber
   * @param {string} requestBody.doctorId
   * @param {string} requestBody.serviceId
   * @param {Date} requestBody.startDate
   * @param {Date} requestBody.endDate
   * @param {string?} requestBody.note
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  createNewSchedule: async requestBody => {
    try {
      const response = await Axios.post(`${baseURL}/schedules`, requestBody);
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
   * Fetch all schedules for a doctor
   * @param {number} doctorId
   * @param {Date} date
   * @return {Promise<{isError: boolean, message: string|null}>}
   */
  fetchSchedules: async (doctorId, date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules?doctorId=${doctorId}&date=${stringDate}`,
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

  fetchDaySchedules: async date => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules/v2/day?&date=${stringDate}`,
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
   * Fetch a list of all patients and schedules for current user
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchSchedulesAndPatients: async () => {
    try {
      const stringDate = moment().format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules/doctor?date=${stringDate}`,
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
   * Fetch a list of working hours for current clinic at a specified week day
   * @param {number} weekDay
   * @param {'week'|'day'} period
   * @return {Promise<{isError: boolean, message: string|null, data: [string]}>}
   */
  fetchClinicWorkHours: async (weekDay, period) => {
    try {
      const response = await Axios.get(
        `${baseURL}/schedules/clinic-workhours?weekDay=${weekDay}&period=${period}`,
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
   * Fetch a list of working hours for current clinic at a specified week day
   * @param {number} weekDay
   * @param {'week'|'day'} period
   * @return {Promise<{isError: boolean, message: string|null, data: [string]}>}
   */
  fetchClinicWorkHoursV2: async (weekDay, period = 'day') => {
    try {
      const response = await Axios.get(
        `${baseURL}/schedules/v2/clinic-workhours?weekDay=${weekDay}&period=${period}`,
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

  fetchMonthSchedules: async (doctorId, date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules/month-schedules?doctorId=${doctorId}&date=${stringDate}`,
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

  fetchScheduleDetails: async scheduleId => {
    try {
      const response = await Axios.get(
        `${baseURL}/schedules/details/${scheduleId}`,
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
   * Finalize patient treatment
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {number} requestBody.scheduleId
   * @param {Array.<{id: number, toothId: string?, completed: boolean}>} requestBody.services
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  finalizeTreatment: async (patientId, requestBody) => {
    try {
      const response = await Axios.put(
        `${baseURL}/patients/${patientId}/finalize-treatment`,
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
   * Fetch all schedules for a patient
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientSchedules: async patientId => {
    try {
      const response = await Axios.get(
        `${baseURL}/schedules/patient-schedules/${patientId}`,
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
   * Delete schedule with specified id
   * @param {string} scheduleId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteSchedule: async scheduleId => {
    try {
      const response = await Axios.delete(
        `${baseURL}/schedules/${scheduleId}/delete`,
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
   * Fetch clinic doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  getClinicDoctors: async () => {
    try {
      const response = await Axios.get(`${baseURL}/clinics/doctors`);
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
   * Fetch clinic invoices
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchClinicInvoices: async () => {
    try {
      const url = `${baseURL}/clinics/invoices`;
      const response = await fetch(url, {
        method: 'get',
        headers: { Authorization: authManager.getUserToken() },
      });
      // const response = await Axios.get(`${baseURL}/clinics/invoices`);
      return await response.json();
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },

  /**
   * Register patient payment
   * @param {Object} requestBody
   * @param {string} requestBody.invoiceId
   * @param {number} requestBody.amount
   * @param {number} requestBody.discount
   * @return {Promise<{isError: boolean, message: string|null, data: any|null}>}
   */
  registerPayment: async requestBody => {
    try {
      const response = await Axios.post(
        `${baseURL}/clinics/register-payment`,
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
   * Get patient treatment plan
   * @param patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchTreatmentPlan: async patientId => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/${patientId}/treatment-plan`,
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

  fetchBracesPlan: async (patientId, planType) => {
    try {
      const response = await Axios.get(
        `${baseURL}/patients/${patientId}/braces-plan/${planType}`,
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
   * Get patient treatment plan
   * @param patientId
   * @param {Object} plan
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  saveTreatmentPlan: async (patientId, plan) => {
    try {
      const response = await Axios.put(
        `${baseURL}/patients/${patientId}/treatment-plan`,
        plan,
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
   * Fetch app general statistics
   * @param {Object} requestData
   * @param {string} requestData.doctorId
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchGeneralStatistics: async requestData => {
    try {
      const { doctorId, fromDate, toDate } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const response = await Axios.get(
        `${baseURL}/analytics/general?doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`,
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
   * Fetch app general statistics
   * @param {Object} requestData
   * @param {string} requestData.doctorId
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchFinanceStatistics: async requestData => {
    try {
      const { doctorId, fromDate, toDate } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const url = `${baseURL}/analytics/finance?doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`;
      const response = await Axios.get(url);
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
   * Fetch services statistics
   * @param {number} page
   * @param {number} rowsPerPage
   * @param {Object} requestData
   * @param {string} requestData.serviceId
   * @param {string} requestData.doctorId
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @param {string} requestData.status
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}|any>}
   */
  fetchServicesStatistics: async (requestData, page, rowsPerPage) => {
    try {
      const { serviceId, doctorId, fromDate, toDate, status } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const url = `${baseURL}/analytics/services?page=${page}&rowsPerPage=${rowsPerPage}&serviceId=${serviceId}&doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}&status=${status}`;
      const response = await Axios.get(url);
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
   * Fetch services statistics
   * @param {Object} requestData
   * @param {string} requestData.serviceId
   * @param {string} requestData.doctorId
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}|any>}
   */
  fetchDoctorsStatistics: async requestData => {
    try {
      const { fromDate, toDate, doctorId, serviceId } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const url = `${baseURL}/analytics/doctors?serviceId=${serviceId}&doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`;
      const response = await Axios.get(url);
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
   * Fetch activity logs from server
   * @param {Object} requestData
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @param {string} requestData.userId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchActivityLogs: async requestData => {
    try {
      const { fromDate, toDate, userId } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const url = `${baseURL}/analytics/activity-logs?userId=${userId}&fromDate=${fromDateString}&toDate=${toDateString}`;
      const response = await Axios.get(url);
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
   * Log user action
   * @param {string} action
   * @param {Object} details
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  sendAction: async (action, details) => {
    try {
      const url = `${baseURL}/clinics/log-action`;
      const response = await Axios.put(url, { action, details });
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
   * Fetch invoice details
   * @param {string} invoiceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchInvoiceDetails: async invoiceId => {
    try {
      const url = `${baseURL}/clinics/invoice/${invoiceId}`;
      const response = await Axios.get(url);
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
   * Fetch braces services
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchBracesServices: async () => {
    try {
      const url = `${baseURL}/services/braces`;
      const response = await Axios.get(url);
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
   * Fetch patient visits
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientVisits: async patientId => {
    try {
      const url = `${baseURL}/patients/${patientId}/visits`;
      const response = await Axios.get(url);
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
   * Edit visit note
   * @param {string} patientId
   * @param {string} scheduleId
   * @param {string} note
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  editVisitNote: async (patientId, scheduleId, note) => {
    try {
      const url = `${baseURL}/patients/${patientId}/edit-visit/${scheduleId}`;
      const response = await Axios.put(url, { note });
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
   * Fetch patient details for doctor
   * @param {string} scheduleId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchDoctorPatientDetails: async scheduleId => {
    try {
      const url = `${baseURL}/schedules/${scheduleId}/doctor-details`;
      const response = await Axios.get(url);
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
   * Change status for a schedule
   * @param {number} scheduleId
   * @param {string} newStatus
   * @param {string?} canceledReason
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  updateScheduleStatus: async (scheduleId, newStatus, canceledReason) => {
    try {
      const url = `${baseURL}/schedules/schedule-status?scheduleId=${scheduleId}&status=${newStatus}`;
      const response = await Axios.put(url, { canceledReason });
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
   * Resend invitation to clinic for user
   * @param {string} userId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  resendUserInvitation: async userId => {
    try {
      const url = `${baseURL}/users/resend-invitation?userId=${userId}`;
      const response = await Axios.put(url);
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
   * Invite existent user to clinic
   * @param {{ emailAddress: string, role: 'RECEPTION'|'DOCTOR'|'MANAGER'}} body
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  inviteUserToClinic: async body => {
    try {
      const url = `${baseURL}/users/send-invitation`;
      const response = await Axios.put(url, body);
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
   * Delete user selected clinic
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteClinic: async () => {
    try {
      const url = `${baseURL}/clinics`;
      const response = await Axios.delete(url);
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
   * Fetch a list of supported providers
   * @return {Promise<{isError: boolean, message: string, data: [string]}|any>}
   */
  fetchSupportedPatientsProviders: async () => {
    try {
      const url = `${baseURL}/patients/upload-providers`;
      const response = await Axios.get(url);
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
   * Upload patients
   * @param {Object} data
   * @param {string} data.mode
   * @param {string} data.fileUrl
   * @param {string} data.fileName
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  uploadPatientsList: async data => {
    try {
      const url = `${baseURL}/patients/upload-patients`;
      const response = await Axios.post(url, data);
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
   * Fetch patient details
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientDetails: async patientId => {
    try {
      const url = `${baseURL}/patients/${patientId}`;
      const response = await Axios.get(url);
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
   * Fetch patient debts
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *, data: [Object]|null}>}
   */
  fetchPatientDebts: async patientId => {
    try {
      const url = `${baseURL}/patients/${patientId}/debts`;
      const response = await Axios.get(url);
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
   * Fetch patient payments
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientPayments: async patientId => {
    try {
      const url = `${baseURL}/patients/${patientId}/invoices`;
      const response = await Axios.get(url);
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
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @param {string} categoryId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  importServices: async (requestBody, categoryId) => {
    try {
      let url = `${baseURL}/services/import`;
      if (categoryId != null) {
        url += `/${categoryId}`;
      }
      const response = await Axios.post(url, requestBody);
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
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @param {Array.<{cellIndex: number, cellType: string}>} requestBody.cellTypes
   * @param {string} categoryId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  parseServices: async (requestBody, categoryId) => {
    try {
      let url = `${baseURL}/services/parse`;
      if (categoryId != null) {
        url += `/${categoryId}`;
      }
      const response = await Axios.post(url, requestBody);
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
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @param {Array.<{cellIndex: number, cellType: string}>} requestBody.cellTypes
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  submitPatientCells: async requestBody => {
    try {
      const url = `${baseURL}/patients/submit-cells`;
      const response = await fetch({
        url: url,
        headers: { Authorization: authManager.getUserToken() },
        method: 'post',
        body: requestBody,
      });
      const responseData = response.body;
      return responseData.getReader();
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },

  /**
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  readExcelColumns: async requestBody => {
    try {
      const url = `${baseURL}/schedules/imported-columns`;
      const response = await Axios.post(url, requestBody);
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
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @param {string} path
   * @param {Array.<{cellIndex: number, cellType: string}>} requestBody.cellTypes
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchExcelDoctorsAndServices: async (requestBody, path = '') => {
    try {
      const url = `${baseURL}/schedules/excel-data/${path}`;
      const response = await Axios.post(url, requestBody);
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
   * Import services from file
   * @param {Object} requestBody
   * @param {string} requestBody.fileUrl
   * @param {string} requestBody.fileName
   * @param {Array.<{target: string, reference: string}>} requestBody.doctors
   * @param {Array.<{target: string, reference: string}>} requestBody.services
   * @param {Array.<{cellIndex: number, cellType: string}>} requestBody.cellTypes
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  importSchedules: async requestBody => {
    try {
      const url = `${baseURL}/schedules/import`;
      const response = await Axios.post(url, requestBody);
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
   * Delete user invitation from clinic
   * @param {number} invitationId
   * @return {Promise<{isError: boolean, message}|any>}
   */
  deleteClinicInvitation: async invitationId => {
    try {
      const url = `${baseURL}/clinics/invitations/delete?invitationId=${invitationId}`;
      const response = await Axios.delete(url);
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

  fetchUserDetails: async userId => {
    try {
      const url = `${baseURL}/users/details/${userId}`;
      const response = await Axios.get(url);
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

  deleteUserHoliday: async (userId, holidayId) => {
    try {
      const url = `${baseURL}/users/${userId}/holidays/${holidayId}`;
      const response = await Axios.delete(url);
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
   * Update clinic braces settings
   * @param {Array.<{id: number, isEnabled: boolean, price: number, duration: number}>} requestBody
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  updateBracesSettings: async requestBody => {
    try {
      const url = `${baseURL}/clinics/braces-types`;
      const response = await Axios.put(url, { services: requestBody });
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
   * Create calendar pause record
   * @param {object} requestBody
   * @param {number} requestBody.doctorId
   * @param {Date} requestBody.startTime
   * @param {Date} requestBody.endTime
   * @param {string?} requestBody.comment
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  createPauseRecord: async requestBody => {
    try {
      const url = `${baseURL}/pauses`;
      const response = await Axios.post(url, requestBody);
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

  getPauseAvailableTime: async requestBody => {
    try {
      const url = `${baseURL}/pauses/available-time`;
      const response = await Axios.put(url, requestBody);
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
