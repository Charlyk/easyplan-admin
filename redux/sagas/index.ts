import { all } from 'redux-saga/effects';
import {
  clinicUsersWatcher,
  scheduleDetailsWatcher,
  clinicServicesWatcher,
  serviceDetailsWatcher,
  deleteCategoryWatcher,
  updateProfileWatcher,
<<<<<<< HEAD
  patientListWatcher,
  deletePatientWatcher,
=======
  pendingInvoicesWatcher,
  fetchExchangeRatesWatcher,
  fetchClinicDetailsWatcher,
>>>>>>> c48ee91cebd3bd06091268a3be9bf1eaecd6fa85
} from './handlers';

export default function* rootSaga() {
  yield all([
    scheduleDetailsWatcher(),
    clinicUsersWatcher(),
    clinicServicesWatcher(),
    serviceDetailsWatcher(),
    deleteCategoryWatcher(),
    updateProfileWatcher(),
<<<<<<< HEAD
    patientListWatcher(),
    deletePatientWatcher(),
=======
    pendingInvoicesWatcher(),
    fetchExchangeRatesWatcher(),
    fetchClinicDetailsWatcher(),
>>>>>>> c48ee91cebd3bd06091268a3be9bf1eaecd6fa85
  ]);
}
