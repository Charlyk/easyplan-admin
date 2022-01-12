import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchUnreadNotification,
  setIsLoading,
  setAppNotification,
} from 'app/components/common/GlobalNotificationView/GlobalNotificationView.reducer';
import { requestFetchUnreadNotifications } from '../../requests';

export function* handleFetchUnreadNotification() {
  try {
    const response: SagaReturnType<typeof requestFetchUnreadNotifications> =
      yield call(requestFetchUnreadNotifications);
    yield put(setAppNotification(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
    yield put(setAppNotification(null));
  }
}

export function* unreadAppNotificationWatcher() {
  yield takeLatest(
    dispatchFetchUnreadNotification,
    handleFetchUnreadNotification,
  );
}
