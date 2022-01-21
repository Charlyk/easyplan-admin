import { call, put, takeLatest } from 'redux-saga/effects';
import {
  dispatchRemoveConnection,
  setIsLoading,
  setMoizvonkiConnection,
} from 'app/components/dashboard/settings/CrmSettings/Integrations/MoizvonkiIntegration/MoizvonkiIntegration.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestDisconnectMoizvonki } from '../../requests';

export function* handleDisconnectMoizvonki() {
  try {
    yield call(requestDisconnectMoizvonki);
    yield put(setMoizvonkiConnection(null));
  } catch (error) {
    yield put(setIsLoading(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* disconnectMoizvonkiWatcher() {
  yield takeLatest(dispatchRemoveConnection.type, handleDisconnectMoizvonki);
}
