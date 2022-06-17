import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  fetchPaymentReports,
  setPaymentReports,
} from 'redux/slices/paymentReportsSlice';
import { ErrorResponse } from 'types/api';
import { PaymentReportsGetRequest } from 'types/api/request';
import { requestFetchPaymentReports } from '../../requests';

function* handleFetchPaymentReports(
  action: PayloadAction<PaymentReportsGetRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestFetchPaymentReports> =
      yield call(requestFetchPaymentReports, action.payload);

    yield put(setPaymentReports(response.data));
  } catch (e) {
    const error = e as ErrorResponse;
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* paymentReportsWatcher() {
  yield takeLatest(fetchPaymentReports.type, handleFetchPaymentReports);
}
