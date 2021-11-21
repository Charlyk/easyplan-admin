import { combineReducers } from 'redux';

import initialState from 'redux/initialState';
import clinicData from 'redux/slices/clinicDataSlice';
import crm from 'redux/slices/crmSlice';
import types from 'redux/types';
import addPaymentModal from './addPaymentModal';
import appointmentModal from './appointmentModal';
import calendar from './calendar';
import clinic from './clinic';
import exchangeRatesModal from './exchangeRatesModal';
import imageModal from './imageModal';
import invoices from './invoiceReducer';
import patientNoteModal from './patientNoteModal';
import patient from './patientReducer';
import patientXRayModal from './patientXRayModal';
import paymentModal from './paymentModal';
import schedule from './scheduleReducer';
import serviceDetailsModal from './serviceDetailsReducer';
import services from './servicesReducer';
import users from './usersReducer';

export default combineReducers({
  main,
  clinic,
  patientNoteModal,
  patientXRayModal,
  appointmentModal,
  paymentModal,
  calendar,
  imageModal,
  serviceDetailsModal,
  addPaymentModal,
  exchangeRatesModal,
  patient,
  schedule,
  invoices,
  services,
  users,
  crm,
  clinicData,
});

function main(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.checkAppointments:
      return { ...state, checkAppointments: !state.checkAppointments };
    case types.updateInvoices:
      return { ...state, updateInvoices: !state.updateInvoices };
    case types.checkDoctorAppointments:
      return {
        ...state,
        checkDoctorAppointments: !state.checkDoctorAppointments,
      };
    case types.updateCategoriesList:
      return {
        ...state,
        updateCategories: !state.updateCategories,
      };
    case types.updateServicesList:
      return {
        ...state,
        updateServices: payload,
      };
    case types.updateUsersList:
      return {
        ...state,
        updateUsers: payload,
      };
    case types.updateXRay:
      return {
        ...state,
        updateXRay: !state.updateXRay,
      };
    case types.updateNotes:
      return {
        ...state,
        updateNotes: !state.updateNotes,
      };
    case types.setUser:
      return {
        ...state,
        user: payload,
      };
    case types.setUpdateCurrentUser:
      return {
        ...state,
        updateCurrentUser: payload,
      };
    case types.changeCurrentClinic:
      return {
        ...state,
        newClinicId: payload,
      };
    case types.triggerUserLogOut:
      return {
        ...state,
        logout: payload,
      };
    case types.forceUserLogout:
      return {
        ...state,
        forceLogout: payload,
      };
    case types.updateAppointmentsList:
      return {
        ...state,
        updateAppointments: !state.updateAppointments,
      };
    case types.updateCalendarDoctorHeight:
      return {
        ...state,
        updateCalendarDoctorHeight: !state.updateCalendarDoctorHeight,
      };
    case types.setPatientDetails:
      return {
        ...state,
        patientDetails: payload,
      };
    case types.toggleUpdatePatients:
      return {
        ...state,
        updatePatients: payload,
      };
    case types.toggleUpdatePatientPayments:
      return {
        ...state,
        updatePatientPayments: !state.updatePatientPayments,
      };
    case types.toggleImportModal:
      return {
        ...state,
        isImportModalOpen: payload,
      };
    case types.toggleExchangeRateUpdate:
      return {
        ...state,
        updateExchangeRates: !state.updateExchangeRates,
      };
    case types.updateDoctorAppointment:
      return {
        ...state,
        updateDoctorAppointments: !state.updateDoctorAppointments,
      };
    case types.setUpdateHourIndicatorPosition:
      return {
        ...state,
        updateHourIndicatorTop: !state.updateHourIndicatorTop,
      };
    default:
      return state;
  }
}
