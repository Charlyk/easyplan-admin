import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { dispatchMarkUpdatesAsRead } from 'app/components/common/modals/ChangeLogsModal/ChangeLogModal.reducer';
import { requestMarkRecentChangesAsRead } from 'redux/sagas/requests';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';

export function* handleMarkUpdatesAsRead(_action: PayloadAction) {
  try {
    yield call(requestMarkRecentChangesAsRead);
  } catch (error) {
    if (error.response !== null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* markUpdatesAsReadWatcher() {
  yield takeLatest(dispatchMarkUpdatesAsRead.type, handleMarkUpdatesAsRead);
}
