import types from '../types';

/**
 * Save clinic doctors into state
 * @param {Array.<Object>} payload
 */
export function setClinicUsers(payload) {
  return {
    type: types.setClinicUsers,
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

/**
 * Update clinic exchange rates status
 * @param {boolean} isRequired
 * @return {{payload, type: string}}
 */
export function setClinicExchangeRatesUpdateRequired(isRequired) {
  return {
    type: types.setClinicExchangeRatesUpdateRequired,
    payload: isRequired,
  };
}
