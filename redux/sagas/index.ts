import { all } from 'redux-saga/effects';
import {
  clinicUsersWatcher,
  scheduleDetailsWatcher,
  clinicServicesWatcher,
  serviceDetailsWatcher,
<<<<<<< HEAD
  deleteCategoriesWatcher,
=======
  updateProfileWatcher,
>>>>>>> 4eefe11deb83b335abd60480acf35bd8d953931f
} from './handlers';

export default function* rootSaga() {
  yield all([
    scheduleDetailsWatcher(),
    clinicUsersWatcher(),
    clinicServicesWatcher(),
    serviceDetailsWatcher(),
<<<<<<< HEAD
    deleteCategoriesWatcher(),
=======
    updateProfileWatcher(),
>>>>>>> 4eefe11deb83b335abd60480acf35bd8d953931f
  ]);
}
