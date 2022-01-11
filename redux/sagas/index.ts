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
} from './handlers';

console.log(patientVisitsWatcher);

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
  ]);
}
