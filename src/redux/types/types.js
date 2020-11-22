import calendar from './calendar';
import clinicTypes from './clinicTypes';
import imageModalTypes from './imageModalTypes';
import seriveDetailsModalTypes from './seriveDetailsModalTypes';

export default {
  setIsAuthenticated: 'setIsAuthenticated',
  updateCategoriesList: 'updateCategoriesList',
  updateServicesList: 'updateServicesList',
  updateUsersList: 'updateUsersList',
  updateXRay: 'updateXRay',
  updateNotes: 'updateNotes',
  setUpdateCurrentUser: 'setUpdateCurrentUser',
  setUser: 'setUser',
  changeCurrentClinic: 'changeCurrentClinic',
  setCreateClinic: 'setCreateClinic',
  triggerUserLogOut: 'triggerUserLogOut',
  setAppointmentModal: 'setAppointmentModal',
  updateAppointmentsList: 'updateAppointmentsList',
  setAddPatientNote: 'setAddPatientNote',
  setAddPatientXRay: 'setAddPatientXRay',
  setPaymentModal: 'setPaymentModal',
  updateCalendarDoctorHeight: 'updateCalendarDoctorHeight',
  checkAppointments: 'checkAppointments',
  updateInvoices: 'updateInvoices',
  checkDoctorAppointments: 'checkDoctorAppointments',
  setPatientDetails: 'setPatientDetails',
  ...clinicTypes,
  ...calendar,
  ...imageModalTypes,
  ...seriveDetailsModalTypes,
};
