import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { requestFetchRemindersCount } from 'redux/sagas/requests';
import {
  dispatchFetchRemindersCount,
  setRemindersCount,
  setIsFetchingRemindersCount,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';

export function* handleFetchRemindersCount() {
  try {
    const response: SagaReturnType<typeof requestFetchRemindersCount> =
      yield call(requestFetchRemindersCount);
    yield put(setRemindersCount(response.data));
  } catch (error) {
    yield put(setIsFetchingRemindersCount(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* remindersCountWatcher() {
  yield takeLatest(dispatchFetchRemindersCount.type, handleFetchRemindersCount);
}
