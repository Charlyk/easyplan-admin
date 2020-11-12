import axios from 'axios';
import moment from 'moment';

import { env } from '../constants';
import authManager from '../settings/authManager';

const baseURL =
  env === 'dev' || env === 'local'
    ? 'https://data.dev.easyplan.pro/api/'
    : env === 'local'
    ? 'http://localhost:5000/api/'
    : 'https://data.prod.easyplan.pro/api/';
export const imageLambdaUrl =
  'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';

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
   * @param {string} requestBody.serviceType
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null, selected: boolean}>} requestBody.doctors
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
   * @param {Array.<{doctorId: string, percentage: number|null, price: number|null, selected: boolean}>} requestBody.doctors
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
   * @param {'notes'|'appointments'} requestBody.mode
   * @param {string} requestBody.scheduleId
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
   * Fetch patient appointments notes
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>}>}
   */
  fetchPatientAppointmentsNotes: async patientId => {
    try {
      const response = await instance().get(
        `patients/${patientId}/appointments-notes`,
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
   * @return {Promise<{isError: boolean, message: string|null, data: {doctors: [Object], components: [Object]}}>}
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
   * Search components by name
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

  /**
   * Update clinic details
   * @param {Object} requestBody
   * @param {string} requestBody.id
   * @param {string} requestBody.clinicName
   * @param {string|null} requestBody.email
   * @param {string|null} requestBody.phoneNumber
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
      const response = await instance().put(`clinics`, requestBody);
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
   * Fetch selected clinic details
   * @return {Promise<{isError: boolean, message: string|null, data: Object}>}
   */
  fetchClinicDetails: async () => {
    try {
      const response = await instance().get(`clinics/details`);
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
   * Fetch current user services
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}>}
   */
  fetchUserServices: async () => {
    try {
      const response = await instance().get(`services/v1/user-services`);
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
      let url = `schedules/available-time?doctorId=${doctorId}&serviceId=${serviceId}&date=${stringDate}`;
      if (scheduleId?.length > 0) {
        url += `&scheduleId=${scheduleId}`;
      }
      const response = await instance().get(url);
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
   * Accept invitation to a clinic
   * @param {string} token
   * @param {string?} password
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  acceptClinicInvitation: async (token, password) => {
    try {
      const response = await instance().put(
        `users/accept-invitation/${token}`,
        { password: password?.length > 0 ? password : null },
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
   * @param {string} requestBody.date
   * @param {string?} requestBody.note
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  createNewSchedule: async requestBody => {
    try {
      const response = await instance().post(`schedules`, requestBody);
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
   * Fetch all schedules for a doctor
   * @param {string} doctorId
   * @param {Date} date
   * @return {Promise<{isError: boolean, message: string|null}>}
   */
  fetchSchedules: async (doctorId, date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await instance().get(
        `schedules?doctorId=${doctorId}&date=${stringDate}`,
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
   * Fetch a list of all patients and schedules for current user
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchSchedulesAndPatients: async () => {
    try {
      const stringDate = moment().format('YYYY-MM-DD');
      const response = await instance().get(
        `schedules/doctor?date=${stringDate}`,
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
   * Fetch a list of working hours for current clinic at a specified week day
   * @param {number} weekDay
   * @param {'week'|'day'} period
   * @return {Promise<{isError: boolean, message: string|null, data: [string]}>}
   */
  fetchClinicWorkHours: async (weekDay, period) => {
    try {
      const response = await instance().get(
        `schedules/clinic-workhours?weekDay=${weekDay}&period=${period}`,
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
   * Fetch a list of working hours for current clinic at a specified week day
   * @param {number} weekDay
   * @param {'week'|'day'} period
   * @return {Promise<{isError: boolean, message: string|null, data: [string]}>}
   */
  fetchClinicWorkHoursV2: async (weekDay, period = 'day') => {
    try {
      const response = await instance().get(
        `schedules/v2/clinic-workhours?weekDay=${weekDay}&period=${period}`,
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

  fetchMonthSchedules: async (doctorId, date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await instance().get(
        `schedules/month-schedules?doctorId=${doctorId}&date=${stringDate}`,
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

  fetchScheduleDetails: async scheduleId => {
    try {
      const response = await instance().get(`schedules/details/${scheduleId}`);
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
   * Finalize patient treatment
   * @param {string} patientId
   * @param {Object} requestBody
   * @param {string} requestBody.scheduleId
   * @param {Array.<{id: string, name: string, price: number, toothId: string?}>} requestBody.services
   * @param {Array.<{id: string, name: string, price: number, toothId: string?}>} requestBody.selectedServices
   * @param {Object} requestBody.treatmentPlan
   * @param {string} requestBody.treatmentPlan.planClass
   * @param {string} requestBody.treatmentPlan.occlusion
   * @param {string} requestBody.treatmentPlan.included
   * @param {string} requestBody.treatmentPlan.radiograph
   * @param {Array.<string>} requestBody.treatmentPlan.fallenBrackets
   * @param {{id: string, toothId: string?, name: string, price: number}} requestBody.treatmentPlan.service
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  finalizeTreatment: async (patientId, requestBody) => {
    try {
      const response = await instance().put(
        `patients/${patientId}/finalize-treatment`,
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
   * Fetch all schedules for a patient
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientSchedules: async patientId => {
    try {
      const response = await instance().get(
        `schedules/patient-schedules/${patientId}`,
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
   * Delete schedule with specified id
   * @param {string} scheduleId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteSchedule: async scheduleId => {
    try {
      const response = await instance().delete(
        `schedules/${scheduleId}/delete`,
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
   * Fetch clinic doctors
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  getClinicDoctors: async () => {
    try {
      const response = await instance().get('clinics/doctors');
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
   * Fetch clinic invoices
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchClinicInvoices: async () => {
    try {
      const response = await instance().get('clinics/invoices');
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
   * Register patient payment
   * @param {Object} requestBody
   * @param {string} requestBody.invoiceId
   * @param {number} requestBody.amount
   * @param {number} requestBody.discount
   * @return {Promise<void>}
   */
  registerPayment: async requestBody => {
    try {
      const response = await instance().post(
        'clinics/register-payment',
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
   * Get patient treatment plan
   * @param patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchTreatmentPlan: async patientId => {
    try {
      const response = await instance().get(
        `patients/${patientId}/treatment-plan`,
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
   * Get patient treatment plan
   * @param patientId
   * @param {Object} plan
   * @param {string} plan.planClass
   * @param {string} plan.occlusion
   * @param {string} plan.included
   * @param {string} plan.radiograph
   * @param {Array.<string>} plan.fallenBrackets
   * @param {{id: string, toothId: string?, name: string, price: number}} plan.service
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  saveTreatmentPlan: async (patientId, plan) => {
    try {
      const response = await instance().put(
        `patients/${patientId}/treatment-plan`,
        plan,
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
      const response = await instance().get(
        `analytics/general?doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`,
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
      const response = await instance().get(
        `analytics/finance?doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`,
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
   * Fetch services statistics
   * @param {Object} requestData
   * @param {string} requestData.serviceId
   * @param {string} requestData.doctorId
   * @param {Date} requestData.fromDate
   * @param {Date} requestData.toDate
   * @param {string} requestData.status
   * @return {Promise<{isError: boolean, message: string|null, data: [Object]}|any>}
   */
  fetchServicesStatistics: async requestData => {
    try {
      const { serviceId, doctorId, fromDate, toDate, status } = requestData;
      const fromDateString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const toDateString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
      const url = `analytics/services?serviceId=${serviceId}&doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}&status=${status}`;
      const response = await instance().get(url);
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
      const url = `analytics/doctors?serviceId=${serviceId}&doctorId=${doctorId}&fromDate=${fromDateString}&toDate=${toDateString}`;
      const response = await instance().get(url);
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
      const url = `analytics/activity-logs?userId=${userId}&fromDate=${fromDateString}&toDate=${toDateString}`;
      const response = await instance().get(url);
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
   * Log user action
   * @param {string} action
   * @param {Object} details
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  sendAction: async (action, details) => {
    try {
      const url = 'clinics/log-action';
      const response = await instance().put(url, { action, details });
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
   * Fetch invoice details
   * @param {string} invoiceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchInvoiceDetails: async invoiceId => {
    try {
      const url = `clinics/invoice/${invoiceId}`;
      const response = await instance().get(url);
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
   * Fetch braces services
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchBracesServices: async () => {
    try {
      const url = 'services/braces';
      const response = await instance().get(url);
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
   * Fetch patient visits
   * @param {string} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientVisits: async patientId => {
    try {
      const url = `patients/${patientId}/visits`;
      const response = await instance().get(url);
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
   * Edit visit note
   * @param {string} patientId
   * @param {string} scheduleId
   * @param {string} note
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  editVisitNote: async (patientId, scheduleId, note) => {
    try {
      const url = `patients/${patientId}/edit-visit/${scheduleId}`;
      const response = await instance().put(url, { note });
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
   * Fetch patient details for doctor
   * @param {string} patientId
   * @param {string} scheduleId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchDoctorPatientDetails: async (patientId, scheduleId) => {
    try {
      const url = `patients/${patientId}/doctor-details/${scheduleId}`;
      const response = await instance().get(url);
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
   * Change status for a schedule
   * @param {string} scheduleId
   * @param {string} newStatus
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  updateScheduleStatus: async (scheduleId, newStatus) => {
    try {
      const url = `schedules/schedule-status?scheduleId=${scheduleId}&status=${newStatus}`;
      const response = await instance().put(url);
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
   * Resend invitation to clinic for user
   * @param {string} userId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  resendUserInvitation: async userId => {
    try {
      const url = `users/resend-invitation?userId=${userId}`;
      const response = await instance().put(url);
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
   * Invite existent user to clinic
   * @param {{ email: string, role: 'RECEPTION'|'DOCTOR'|'MANAGER'}} body
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  inviteExistentUser: async body => {
    try {
      const url = `users/invite-existent`;
      const response = await instance().post(url, body);
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
   * Delete user selected clinic
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  deleteClinic: async () => {
    try {
      const url = `clinics`;
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
};
