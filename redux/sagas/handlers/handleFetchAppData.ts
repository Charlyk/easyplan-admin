import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  setCurrentEntities,
  dispatchFetchAppData,
} from 'redux/slices/appDataSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchAppData } from '../requests';

export function* handleFetchAppData(action: PayloadAction<any>) {
  try {
    const response: SagaReturnType<typeof requestFetchAppData> = yield call(
      requestFetchAppData,
      action.payload,
    );
    yield put(setCurrentEntities(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* appDataWatcher() {
  yield takeLatest(dispatchFetchAppData.type, handleFetchAppData);
}
