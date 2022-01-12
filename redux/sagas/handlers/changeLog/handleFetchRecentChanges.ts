import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchChangeLogData,
  setChangeLogDataToStore,
} from 'app/components/common/modals/ChangeLogsModal/ChangeLogModal.reducer';
import { requestFetchRecentChanges } from 'redux/sagas/requests';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';

export function* handleFetchRecentChanges(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestFetchRecentChanges> =
      yield call(requestFetchRecentChanges);

    yield put(setChangeLogDataToStore(response.data));
  } catch (error) {
    if (error.response !== null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* changeLogWatcher() {
  yield takeLatest(dispatchFetchChangeLogData.type, handleFetchRecentChanges);
}
