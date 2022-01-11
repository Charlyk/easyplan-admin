import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchMarkNotificationAsRead,
  setIsLoading,
  setAppNotification,
} from 'app/components/common/GlobalNotificationView/GlobalNotificationView.reducer';
import { requestMarkNotificationAsRead } from '../../requests';

export function* handleMarkNotificationAsRead(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestMarkNotificationAsRead> =
      yield call(requestMarkNotificationAsRead, action.payload);
    yield put(setAppNotification(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
    yield put(setAppNotification(null));
  }
}

export function* markNotificationAsReadWatcher() {
  yield takeLatest(
    dispatchMarkNotificationAsRead,
    handleMarkNotificationAsRead,
  );
}
