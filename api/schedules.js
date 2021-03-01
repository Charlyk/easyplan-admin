import moment from "moment-timezone";
import Axios from "axios";

export const baseURL = 'https://api.easyplan.pro/api'

export async function getDaySchedules(date, headers) {
  try {
    const stringDate = moment(date).format('YYYY-MM-DD');
    const response = await Axios.get(
      `${baseURL}/schedules/v2/day?&date=${stringDate}`,
      { headers }
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
}

export async function fetchDaySchedulesHours(date, headers) {
  try {
    const stringDate = moment(date).format('YYYY-MM-DD');
    const response = await Axios.get(
      `${baseURL}/schedules/day-hours?&date=${stringDate}`,
      { headers },
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
}

export default {
  /**
   * Fetch all schedules for a specified date
   * @param {Date} date
   * @return {Promise<{isError: boolean, message: string, data: Object|null}>}
   */
  fetchDaySchedules: async (date) => {
    try {
      const stringDate = moment(date).format('YYYY-MM-DD');
      const response = await Axios.get(
        `${baseURL}/schedules/v2/day?&date=${stringDate}`,
      );
      console.log(response);
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
   * Fetch all details for a schedule
   * @param {number} scheduleId
   * @return {Promise<{isError: boolean, message: string, data: Object|null}>}
   */
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
}
