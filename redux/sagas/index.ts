import { all } from 'redux-saga/effects';
import {
  clinicUsersWatcher,
  scheduleDetailsWatcher,
  clinicServicesWatcher,
  serviceDetailsWatcher,
  deleteCategoryWatcher,
  updateProfileWatcher,
  pendingInvoicesWatcher,
  fetchExchangeRatesWatcher,
  fetchClinicDetailsWatcher,
} from './handlers';

export default function* rootSaga() {
  yield all([
    scheduleDetailsWatcher(),
    clinicUsersWatcher(),
    clinicServicesWatcher(),
    serviceDetailsWatcher(),
    deleteCategoryWatcher(),
    updateProfileWatcher(),
    pendingInvoicesWatcher(),
    fetchExchangeRatesWatcher(),
    fetchClinicDetailsWatcher(),
  ]);
}
