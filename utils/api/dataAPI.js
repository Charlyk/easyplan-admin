import Axios from 'axios';
import moment from 'moment-timezone';

import { env } from '../constants';
import authManager from '../settings/authManager';

export const baseURL = 'https://api.easyplan.pro/api'
  // env === 'dev'
  //   ? 'https://api.easyplan.pro/api'
  //   : env === 'local'
  //   ? 'http://localhost:8080/api'
  //   : 'http://localhost:8080/api';
export const imageLambdaUrl =
  'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';

export default {
  /**
   * Fetch all categories
   * @param {string|null} categoryId
   * @return {Promise<{isError: boolean, message: string|null, data: Array.<Object>|null}>}
   */
  fetchServices: async (categoryId) => {
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
  createUser: async (requestBody) => {
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
  deleteUser: async (userId) => {
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
  restoreUser: async (userId) => {
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
  deletePatient: async (patientId) => {
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
  fetchPatientNotes: async (patientId) => {
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
   * Fetch all X-Ray images for a patient
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientXRayImages: async (patientId) => {
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
   * Search patients by phone or name
   * @param {string} query
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  searchPatients: async (query) => {
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
  searchDoctors: async (query) => {
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
   * Create new clinic
   * @param {Object} requestBody
   * @param {string} requestBody.clinicName
   * @param {string|null} requestBody.website
   * @param {string|null} requestBody.description
   * @param {string|null} requestBody.logo
   * @param {boolean} requestBody.hasBrackets
   * @return {Promise<void>}
   */
  createClinic: async (requestBody) => {
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
  updateClinic: async (requestBody) => {
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
  acceptClinicInvitation: async (requestBody) => {
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
  createNewSchedule: async (requestBody) => {
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

  fetchDaySchedulesHours: async (date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules/day-hours?&date=${stringDate}`,
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

  fetchScheduleDetails: async (scheduleId) => {
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
  fetchPatientSchedules: async (patientId) => {
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
  deleteSchedule: async (scheduleId) => {
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
   * Register patient payment
   * @param {Object} requestBody
   * @param {number} invoiceId
   * @param {number} requestBody.paidAmount
   * @param {number} requestBody.discount
   * @param {number} requestBody.totalAmount
   * @param {Array.<{id: number, serviceId: number, currency: string, count: number, price: number}>} requestBody.services
   * @return {Promise<{isError: boolean, message: string|null, data: any|null}>}
   */
  registerPayment: async (invoiceId, requestBody) => {
    try {
      const response = await Axios.put(
        `${baseURL}/invoices/${invoiceId}`,
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
   * Register patient payment
   * @param {Object} requestBody
   * @param {number} requestBody.patientId
   * @param {number} requestBody.doctorId?
   * @param {number} requestBody.paidAmount
   * @param {number} requestBody.discount
   * @param {number} requestBody.totalAmount
   * @param {Array.<{id: number, serviceId: number, currency: string, count: number, price: number}>} requestBody.services
   * @return {Promise<{isError: boolean, message: string|null, data: any|null}>}
   */
  createNewInvoice: async (requestBody) => {
    try {
      const response = await Axios.post(`${baseURL}/invoices`, requestBody);
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
  fetchTreatmentPlan: async (patientId) => {
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

  /**
   * Get patient treatment plan
   * @param patientId
   * @param {Object} plan
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  saveTreatmentPlan: async (patientId, plan) => {
    try {
      const response = await Axios.post(
        `${baseURL}/treatment-plans/orthodontic`,
        { ...plan, patientId },
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
   * @param {number} invoiceId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchInvoiceDetails: async (invoiceId) => {
    try {
      const url = `${baseURL}/invoices/${invoiceId}`;
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
  fetchDoctorPatientDetails: async (scheduleId) => {
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
   * @param {string|null} canceledReason
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
   * Set schedule as confirmed
   * @param {number} scheduleId
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  getScheduleInfo: async (scheduleId, patientId) => {
    try {
      const url = `${baseURL}/confirmation/schedule/${scheduleId}/${patientId}`;
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
   * Set schedule as confirmed
   * @param {number} scheduleId
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  setScheduleConfirmed: async (scheduleId, patientId) => {
    try {
      const url = `${baseURL}/confirmation/schedule`;
      const response = await Axios.post(url, { scheduleId, patientId });
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
   * Upload patients
   * @param {Object} data
   * @param {string} data.mode
   * @param {string} data.fileUrl
   * @param {string} data.fileName
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  uploadPatientsList: async (data) => {
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
   * Fetch patient payments
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  fetchPatientPayments: async (patientId) => {
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
   * @return {Promise<{isError: boolean, message: *}|any>}
   */
  readExcelColumns: async (requestBody) => {
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

  fetchUserDetails: async (userId) => {
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

  /**
   * Update clinic braces settings
   * @param {Array.<{id: number, isEnabled: boolean, price: number, duration: number}>} requestBody
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  updateBracesSettings: async (requestBody) => {
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
  createPauseRecord: async (requestBody) => {
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

  getPauseAvailableTime: async (requestBody) => {
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

  /**
   * Add a purchase to a patient
   * @param {{ amount: number, discount: number, comment: string }} requestBody
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  addPatientPurchase: async (patientId, requestBody) => {
    try {
      const url = `${baseURL}/patients/purchases/${patientId}`;
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
   * Fetch all purchases for a patient
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  getPatientPurchases: async (patientId) => {
    try {
      const url = `${baseURL}/patients/purchases/${patientId}`;
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
   * Update patient treatment plan
   * @param {Object} requestBody
   * @param {number} requestBody.patientId
   * @param {number} requestBody.scheduleId
   * @param {Array.<{serviceId: number, toothId: string|number, price: number, destination: string, currency: string}>} requestBody.services
   * @return {Promise<{isError: boolean, message: string}|{isError: boolean, message}|any>}
   */
  updatePatientTreatmentPlan: async (requestBody) => {
    try {
      const url = `${baseURL}/treatment-plans/general`;
      requestBody.services = requestBody.services.map((item) => ({
        ...item,
        completed: false,
        count: 1,
      }));
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

  savePatientTreatmentPlan: async (requestBody) => {
    try {
      const url = `${baseURL}/treatment-plans/general`;
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
   * Fetch all messages received by a patient
   * @param {number} patientId
   * @return {Promise<{isError: boolean, message: string, data: any|null}>}
   */
  fetchPatientMessages: async (patientId) => {
    try {
      const url = `${baseURL}/sms/patients/${patientId}`;
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
   * Sent SMS message to single patient
   * @param {number} patientId
   * @param {string} message
   * @return {Promise<{isError: boolean, message: string, data: any|null}>}
   */
  sendMessageToPatient: async (patientId, message) => {
    try {
      const url = `${baseURL}/sms/patients/${patientId}`;
      const response = await Axios.post(url, { messageText: message });
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
   * Create new sms message
   * @param {{messageTitle: string, messageText: string, messageType: string, hour: string, messageDate: string?}} requestBody
   * @param {number} messageId
   * @return {Promise<{isError: boolean, message: string|null, data: any}>}
   */
  editSMSMessage: async (messageId, requestBody) => {
    try {
      const url = `${baseURL}/sms/${messageId}`;
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

  /**
   * Delete sms message
   * @param {number} messageId
   * @return {Promise<{isError: boolean, message: string}>}
   */
  deleteMessage: async (messageId) => {
    try {
      const url = `${baseURL}/sms/${messageId}`;
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
   * Fetch a list of available timezones
   * @return {Promise<{isError: boolean, message: string, data: Array.<string>|null}>}
   */
  getAvailableTimeZones: async () => {
    try {
      let url = `${baseURL}/clinics/available-timezones`;
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
};
