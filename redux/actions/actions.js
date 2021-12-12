import types from '../types';

/**
 * Trigger users list update
 * @param {boolean} update
 * @return {{payload: string, type: string}}
 */
export function triggerUsersUpdate(update) {
  return {
    type: types.updateUsersList,
    payload: update,
  };
}

/**
 * Trigger patient notes list update
 * @return {{payload: string, type: string}}
 */
export function triggerUpdateNotes() {
  return {
    type: types.updateNotes,
    payload: '',
  };
}

/**
 * Trigger patient x-ray images update
 * @return {{payload: string, type: string}}
 */
export function triggerUpdateXRay() {
  return {
    type: types.updateXRay,
    payload: '',
  };
}

/**
 * Trigger user logout modal
 * @param {boolean} logout
 * @return {{payload: *, type: string}}
 */
export function triggerUserLogout(logout) {
  return {
    type: types.triggerUserLogOut,
    payload: logout,
  };
}

export function toggleAppointmentsUpdate() {
  return {
    type: types.updateAppointmentsList,
    payload: '',
  };
}

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

export function toggleUpdateInvoices() {
  return {
    type: types.updateInvoices,
    payload: '',
  };
}

/**
 * Toggle patient details
 * @param {Object} payload
 * @param {boolean} payload.show
 * @param {(number|null)?} payload.patientId
 * @param {boolean} payload.canDelete
 * @return {{payload: *, type: string}}
 */
export function setPatientDetails(payload) {
  return {
    type: types.setPatientDetails,
    payload,
  };
}

export function togglePatientsListUpdate(update) {
  return {
    type: types.toggleUpdatePatients,
    payload: update,
  };
}

export function toggleImportModal(open = false) {
  return {
    type: types.toggleImportModal,
    payload: open,
  };
}

export function toggleExchangeRateUpdate() {
  return {
    type: types.toggleExchangeRateUpdate,
    payload: '',
  };
}
