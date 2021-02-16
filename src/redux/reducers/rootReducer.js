import { combineReducers } from 'redux';

import initialState from '../initialState';
import types from '../types/types';
import addPaymentModal from './addPaymentModal';
import appointmentModal from './appointmentModal';
import calendar from './calendar';
import clinic from './clinic';
import createClinicModal from './createClinicModal';
import exchangeRatesModal from './exchangeRatesModal';
import imageModal from './imageModal';
import invoices from './invoiceReducer';
import patientNoteModal from './patientNoteModal';
import patient from './patientReducer';
import patientXRayModal from './patientXRayModal';
import paymentModal from './paymentModal';
import schedule from './scheduleReducer';
import serviceDetailsModal from './serviceDetailsReducer';

export default combineReducers({
  main,
  clinic,
  patientNoteModal,
  patientXRayModal,
  appointmentModal,
  paymentModal,
  createClinicModal,
  calendar,
  imageModal,
  serviceDetailsModal,
  addPaymentModal,
  exchangeRatesModal,
  patient,
  schedule,
  invoices,
});

function main(state = initialState, action) {
  switch (action.type) {
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
        updateServices: !state.updateServices,
      };
    case types.updateUsersList:
      return {
        ...state,
        updateUsers: !state.updateUsers,
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
        user: action.payload,
      };
    case types.setUpdateCurrentUser:
      return {
        ...state,
        updateCurrentUser: action.payload,
      };
    case types.changeCurrentClinic:
      return {
        ...state,
        newClinicId: action.payload,
      };
    case types.triggerUserLogOut:
      return {
        ...state,
        logout: action.payload,
      };
    case types.forceUserLogout:
      return {
        ...state,
        forceLogout: action.payload,
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
        patientDetails: action.payload,
      };
    case types.toggleUpdatePatients:
      return {
        ...state,
        updatePatients: !state.updatePatients,
      };
    case types.toggleUpdatePatientPayments:
      return {
        ...state,
        updatePatientPayments: !state.updatePatientPayments,
      };
    case types.toggleImportModal:
      return {
        ...state,
        isImportModalOpen: action.payload,
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
    default:
      return state;
  }
}
