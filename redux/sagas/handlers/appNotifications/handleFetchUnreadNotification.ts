import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchUnreadNotification,
  setIsLoading,
  setAppNotification,
} from 'app/components/common/GlobalNotificationView/GlobalNotificationView.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchUnreadNotifications } from '../../requests';

export function* handleFetchUnreadNotification() {
  try {
    const response: SagaReturnType<typeof requestFetchUnreadNotifications> =
      yield call(requestFetchUnreadNotifications);
    yield put(setAppNotification(response.data));
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

export function* unreadAppNotificationWatcher() {
  yield takeLatest(
    dispatchFetchUnreadNotification,
    handleFetchUnreadNotification,
  );
}
