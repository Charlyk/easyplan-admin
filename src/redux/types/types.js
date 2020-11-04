import calendar from './calendar';
import clinicTypes from './clinicTypes';
import imageModalTypes from './imageModalTypes';

export default {
  setIsAuthenticated: 'setIsAuthenticated',
  updateCategoriesList: 'updateCategoriesList',
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
  ...clinicTypes,
  ...calendar,
  ...imageModalTypes,
};
