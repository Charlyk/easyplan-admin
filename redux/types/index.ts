import addPaymentModalTypes from './addPaymentModalTypes';
import calendar from './calendar';
import clinicTypes from './clinicTypes';
import exchangeRatesTypes from './exchangeRatesTypes';
import imageModalTypes from './imageModalTypes';
import invoiceTypes from './invoiceTypes';
import schedule from './schedule';
import seriveDetailsModalTypes from './seriveDetailsModalTypes';
import servicesTypes from './servicesTypes';
import usersTypes from './usersTypes';

export * from './types';

export default {
  setIsAuthenticated: 'setIsAuthenticated',
  updateCategoriesList: 'updateCategoriesList',
  updateServicesList: 'updateServicesList',
  updateUsersList: 'updateUsersList',
  updateXRay: 'updateXRay',
  updateNotes: 'updateNotes',
  setUser: 'setUser',
  changeCurrentClinic: 'changeCurrentClinic',
  triggerUserLogOut: 'triggerUserLogOut',
  updateAppointmentsList: 'updateAppointmentsList',
  setAddPatientNote: 'setAddPatientNote',
  setAddPatientXRay: 'setAddPatientXRay',
  setPaymentModal: 'setPaymentModal',
  updateCalendarDoctorHeight: 'updateCalendarDoctorHeight',
  checkAppointments: 'checkAppointments',
  updateInvoices: 'updateInvoices',
  checkDoctorAppointments: 'checkDoctorAppointments',
  setPatientDetails: 'setPatientDetails',
  toggleUpdatePatients: 'toggleUpdatePatients',
  toggleUpdatePatientPayments: 'toggleUpdatePatientPayments',
  forceUserLogout: 'forceUserLogout',
  toggleImportModal: 'toggleImportModal',
  toggleExchangeRateUpdate: 'toggleExchangeRateUpdate',
  updateDoctorAppointment: 'updateDoctorAppointment',
  setUpdateHourIndicatorPosition: 'setUpdateHourIndicatorPosition',
  ...clinicTypes,
  ...calendar,
  ...imageModalTypes,
  ...seriveDetailsModalTypes,
  ...addPaymentModalTypes,
  ...exchangeRatesTypes,
  ...schedule,
  ...invoiceTypes,
  ...servicesTypes,
  ...usersTypes,
};
