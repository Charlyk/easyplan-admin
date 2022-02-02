import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchDealDetails,
  setDealDetails,
  setIsFetchingDetails,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchDealDetails } from '../../requests';

export function* handleFetchDealDetails(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestFetchDealDetails> = yield call(
      requestFetchDealDetails,
      action.payload,
    );
    yield put(setDealDetails(response.data));
  } catch (error) {
    yield put(setIsFetchingDetails(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* dealDetailsWatcher() {
  yield takeLatest(dispatchFetchDealDetails.type, handleFetchDealDetails);
}
