import {
  call,
  put,
  SagaReturnType,
  takeLatest,
} from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  requestSubscriptionInfo,
  requestInvoices,
  requestPaymentMethods,
} from 'redux/sagas/requests/payments/payments';
import {
  dispatchFetchSubscriptionInfo,
  setSubscriptionInfo,
  setSubscriptionInfoError,
  dispatchFetchInvoices,
  setInvoices,
  setInvoicesError,
  dispatchFetchPaymentMethods,
  setPaymentMethods,
  setPaymentMethodsError,
} from 'redux/slices/paymentSlice';
import { ErrorResponse } from 'types/api';

function* handleRequestSubscriptionInfo(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestSubscriptionInfo> = yield call(
      requestSubscriptionInfo,
    );
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setSubscriptionInfoError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleFetchInvoices(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestInvoices> = yield call(
      requestSubscriptionInfo,
    );
    yield put(setInvoices(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setInvoicesError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleFetchPaymentMethods(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestPaymentMethods> = yield call(
      requestPaymentMethods,
    );
    yield put(setPaymentMethods(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setPaymentMethodsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

export function* fetchPaymentMethodsWatcher() {
  yield takeLatest(dispatchFetchPaymentMethods.type, handleFetchPaymentMethods);
}

export function* fetchInvoicesWatcher() {
  yield takeLatest(dispatchFetchInvoices.type, handleFetchInvoices);
}

export function* fetchSubscriptionInfoWatcher() {
  yield takeLatest(
    dispatchFetchSubscriptionInfo.type,
    handleRequestSubscriptionInfo,
  );
}
