import types from '../types';

/**
 * Toggle create note modal
 * @param {Object} payload
 * @param {boolean} payload.open
 * @param {string?} payload.patientId
 * @param {('notes'|'appointments'|'visits'|null)?} payload.mode
 * @param {string?} payload.scheduleId
 * @return {{payload: *, type: string}}
 */
export function setPatientNoteModal(payload) {
  return {
    type: types.setAddPatientNote,
    payload,
  };
}

/**
 * Toggle add x-ray image modal
 * @param {Object} payload
 * @param {boolean} payload.open
 * @param {string|null} payload.patientId
 * @return {{payload: *, type: string}}
 */
export function setPatientXRayModal(payload) {
  return {
    type: types.setAddPatientXRay,
    payload,
  };
}

/**
 * Toggle payment modal
 * @param {{open: boolean, invoice: Object?, isNew: boolean?, schedule: Object?}} payload
 * @return {{payload: *, type: string}}
 */
export function setPaymentModal(payload) {
  return {
    type: types.setPaymentModal,
    payload,
  };
}
