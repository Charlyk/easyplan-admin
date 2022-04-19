import { all } from 'redux-saga/effects';
import {
  clinicUsersWatcher,
  scheduleDetailsWatcher,
  clinicServicesWatcher,
  serviceDetailsWatcher,
  deleteCategoryWatcher,
  updateProfileWatcher,
  patientListWatcher,
  deletePatientWatcher,
  pendingInvoicesWatcher,
  fetchExchangeRatesWatcher,
  fetchClinicDetailsWatcher,
  remindersCountWatcher,
  dealsStatesWatcher,
  appDataWatcher,
  pubnubWatcher,
  updateScheduleDoctorAndDateWatcher,
  patientCallRecordsWatcher,
  doctorCalendarOrderWatcher,
  patientVisitsWatcher,
  createPatientWatcher,
  patientPurchasesWatcher,
  undoInvoicePaymentsWatcher,
  updateVisitNoteWatcher,
  changeLogWatcher,
  markUpdatesAsReadWatcher,
  unreadAppNotificationWatcher,
  markNotificationAsReadWatcher,
  clinicSettingsWatcher,
  updateConfirmationDoctorWatcher,
  moizvonkiConnectionWatcher,
  updateMoizvonkiConnectionWatcher,
  disconnectMoizvonkiWatcher,
  fetchCrmFilterWatcher,
  updateCrmFilterWatcher,
  fetchGroupedDealsWatcher,
  updateDealStateWatcher,
  createNewReminderWatcher,
  createDealStateWatcher,
  deleteDealStateWatcher,
  dealDetailsWatcher,
  createNewAppointmentWatcher,
  fetchAppointmentEndHoursWatcher,
  fetchAppointmentSchedulesWatcher,
  fetchAppointmentServicesWatcher,
  fetchAppointmentStartHoursWatcher,
  fetchAppointmentDoctorsWatcher,
  fetchFilteredPatientsWatcher,
  createAppointmentPatientWatcher,
  updateUserLanguageWatcher,
} from './handlers';

export default function* rootSaga() {
  yield all([
    scheduleDetailsWatcher(),
    clinicUsersWatcher(),
    clinicServicesWatcher(),
    serviceDetailsWatcher(),
    deleteCategoryWatcher(),
    updateProfileWatcher(),
    patientListWatcher(),
    deletePatientWatcher(),
    pendingInvoicesWatcher(),
    fetchExchangeRatesWatcher(),
    fetchClinicDetailsWatcher(),
    remindersCountWatcher(),
    dealsStatesWatcher(),
    appDataWatcher(),
    pubnubWatcher(),
    updateScheduleDoctorAndDateWatcher(),
    patientCallRecordsWatcher(),
    doctorCalendarOrderWatcher(),
    changeLogWatcher(),
    patientVisitsWatcher(),
    createPatientWatcher(),
    patientPurchasesWatcher(),
    undoInvoicePaymentsWatcher(),
    updateVisitNoteWatcher(),
    markUpdatesAsReadWatcher(),
    unreadAppNotificationWatcher(),
    markNotificationAsReadWatcher(),
    clinicSettingsWatcher(),
    updateConfirmationDoctorWatcher(),
    moizvonkiConnectionWatcher(),
    updateMoizvonkiConnectionWatcher(),
    disconnectMoizvonkiWatcher(),
    fetchCrmFilterWatcher(),
    updateCrmFilterWatcher(),
    fetchGroupedDealsWatcher(),
    updateDealStateWatcher(),
    createNewReminderWatcher(),
    createDealStateWatcher(),
    deleteDealStateWatcher(),
    dealDetailsWatcher(),
    createNewAppointmentWatcher(),
    fetchAppointmentStartHoursWatcher(),
    fetchAppointmentEndHoursWatcher(),
    fetchAppointmentSchedulesWatcher(),
    fetchAppointmentServicesWatcher(),
    fetchAppointmentDoctorsWatcher(),
    fetchFilteredPatientsWatcher(),
    createAppointmentPatientWatcher(),
    updateUserLanguageWatcher(),
  ]);
}
