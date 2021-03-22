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
};
