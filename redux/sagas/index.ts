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
  patientCallRecordsWatcher,
  doctorCalendarOrderWatcher,
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
    patientCallRecordsWatcher(),
    doctorCalendarOrderWatcher(),
  ]);
}
