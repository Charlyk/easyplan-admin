import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchMarkNotificationAsRead,
  setIsLoading,
  setAppNotification,
} from 'app/components/common/GlobalNotificationView/GlobalNotificationView.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestMarkNotificationAsRead } from '../../requests';

export function* handleMarkNotificationAsRead(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestMarkNotificationAsRead> =
      yield call(requestMarkNotificationAsRead, action.payload);
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

export function* markNotificationAsReadWatcher() {
  yield takeLatest(
    dispatchMarkNotificationAsRead,
    handleMarkNotificationAsRead,
  );
}
