import types from 'redux/types';

/**
 * Trigger categories list update
 * @return {{payload: string, type: string}}
 */
export function triggerCategoriesUpdate() {
  return {
    type: types.updateCategoriesList,
    payload: '',
  };
}

export function triggerServicesUpdate(update) {
  return {
    type: types.updateServicesList,
    payload: update,
  };
}

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
 * Save current user to store
 * @param user
 * @return {{payload: *, type: string}}
 */
export function setCurrentUser(user) {
  return {
    type: types.setUser,
    payload: user,
  };
}

/**
 * Toggle clinic change
 * @param {string} clinicId
 * @return {{payload: *, type: string}}
 */
export function changeSelectedClinic(clinicId) {
  return {
    type: types.changeCurrentClinic,
    payload: clinicId,
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

export function toggleForceLogoutUser(logout) {
  return {
    type: types.forceUserLogout,
    payload: logout,
  };
}

/**
 * Toggle appointment creation modal
 * @param {Object} modalData
 * @param {boolean} modalData.open
 * @param {Object?} modalData.doctor
 * @param {Date?} modalData.date
 * @param {Object?} modalData.schedule
 * @param {Object?} modalData.patient
 * @param {string?} modalData.startHour
 * @param {string?} modalData.endHour
 * @return {{payload: *, type: string}}
 */
export function setAppointmentModal(modalData) {
  return {
    type: types.setAppointmentModal,
    payload: modalData,
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

export function toggleUpdateCalendarDoctorHeight() {
  return {
    type: types.updateCalendarDoctorHeight,
    payload: '',
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
 * @param {function|null} payload.onDelete
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

export function togglePatientPaymentsUpdate() {
  return {
    type: types.toggleUpdatePatientPayments,
    payload: '',
  };
}

export function toggleCheckDoctorAppointments() {
  return {
    type: types.checkDoctorAppointments,
    payload: '',
  };
}

export function setUpdateCurrentUser(update = true) {
  return {
    type: types.setUpdateCurrentUser,
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

export function toggleUpdateDoctorAppointment() {
  return {
    type: types.updateDoctorAppointment,
    payload: '',
  };
}
