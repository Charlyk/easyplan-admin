import types from '../types/types';

/**
 * Save clinic doctors into state
 * @param {Array.<Object>} payload
 */
export function setClinicDoctors(payload) {
  return {
    type: types.setClinicDoctors,
    payload,
  };
}

/**
 * Save clinic services into state
 * @param {Array.<Object>} payload
 * @return {{payload: *, type: string}}
 */
export function setClinicServices(payload) {
  return {
    type: types.setClinicServices,
    payload,
  };
}

export function setClinic(payload) {
  return {
    type: types.setClinicDetails,
    payload,
  };
}
