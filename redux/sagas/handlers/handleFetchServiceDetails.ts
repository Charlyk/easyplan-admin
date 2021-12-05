import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  setError,
  setServiceDetails,
  fetchServiceDetails,
} from 'redux/slices/servicesListSlice';
import { requestFetchServiceDetails } from '../requests';

export function* handleFetchServiceDetails(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestFetchServiceDetails> =
      yield call(requestFetchServiceDetails, action.payload);
    yield put(setServiceDetails(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(setError(data?.message ?? error.message));
    } else {
      yield put(setError(error.message));
    }
  }
}

export function* serviceDetailsWatcher() {
  yield takeLatest(fetchServiceDetails.type, handleFetchServiceDetails);
}
