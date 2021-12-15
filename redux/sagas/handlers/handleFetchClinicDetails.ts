import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  requestUpdateCurrentClinic,
  setCurrentClinic,
  setIsUpdatingClinic,
} from 'redux/slices/appDataSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchClinic } from '../requests';

export function* handleFetchClinicDetails(action: PayloadAction<string>) {
  try {
    const response: SagaReturnType<typeof requestFetchClinic> = yield call(
      requestFetchClinic,
      action.payload,
    );
    setCurrentClinic(response.data);
  } catch (error) {
    yield put(setIsUpdatingClinic(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* fetchClinicDetailsWatcher() {
  yield takeLatest(requestUpdateCurrentClinic.type, handleFetchClinicDetails);
}
