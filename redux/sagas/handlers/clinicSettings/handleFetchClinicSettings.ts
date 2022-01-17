import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  setClinicSettings,
  setIsFetching,
  dispatchFetchSettings,
} from 'app/components/dashboard/settings/ApplicationSettings/ClinicSettings/ClinicSettings.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchClinicSettings } from '../../requests';

export function* handleFetchClinicSettings() {
  try {
    const response: SagaReturnType<typeof requestFetchClinicSettings> =
      yield call(requestFetchClinicSettings);
    console.log(response.data);
    yield put(setClinicSettings(response.data));
  } catch (error) {
    yield put(setIsFetching(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* clinicSettingsWatcher() {
  yield takeLatest(dispatchFetchSettings.type, handleFetchClinicSettings);
}
