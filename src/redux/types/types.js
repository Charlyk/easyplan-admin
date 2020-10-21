import clinicTypes from './clinicTypes';

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
  ...clinicTypes,
};
