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
  postNewPaymentMethod,
  deletePaymentMethod,
  setPaymentMethodAsDefault,
  requestPurchaseSeats,
  requestRemoveSeats,
  requestBillingPeriodChange,
  requestCancelSubscription,
} from 'redux/sagas/requests/payments/payments';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
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
  dispatchAddNewPaymentMethod,
  dispatchDeletePaymentMethod,
  closeNewCardModal,
  dispatchSetPaymentMethodAsDefault,
  setPaymentMethodAsDefault as stateSetPaymentMethodAsDefault,
  dispatchPurchaseSeats,
  dispatchRemoveSeats,
  dispatchChangeBillingPeriod,
  dispatchCancelSubcription,
} from 'redux/slices/paymentSlice';
import { ErrorResponse, PaymentCardData } from 'types/api';

function* handleRequestSubscriptionInfo(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestSubscriptionInfo> = yield call(
      requestSubscriptionInfo,
    );
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
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
      requestInvoices,
    );
    yield put(setInvoices(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
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
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setPaymentMethodsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleAddPaymentMethod(action: PayloadAction<PaymentCardData>) {
  try {
    const response: SagaReturnType<typeof postNewPaymentMethod> = yield call(
      postNewPaymentMethod,
      action.payload,
    );
    yield put(closeNewCardModal());
    yield put(setPaymentMethods(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setPaymentMethodsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleDeletePaymentMethod(
  action: PayloadAction<{ id: string | number }>,
) {
  try {
    const response: SagaReturnType<typeof deletePaymentMethod> = yield call(
      deletePaymentMethod,
      action.payload.id,
    );
    yield put(setPaymentMethods(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setPaymentMethodsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleSetPaymentMethodAsDefault(
  action: PayloadAction<{ id: string }>,
) {
  try {
    yield call(setPaymentMethodAsDefault, action.payload);
    yield put(stateSetPaymentMethodAsDefault(action.payload));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setPaymentMethodsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handlePurchaseSeats(
  action: PayloadAction<{ seats: number; interval: 'MONTH' | 'YEAR' }>,
) {
  try {
    const response: SagaReturnType<typeof requestPurchaseSeats> = yield call(
      requestPurchaseSeats,
      action.payload,
    );
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setSubscriptionInfoError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleRemoveSeats(action: PayloadAction<{ seats: number }>) {
  try {
    const response: SagaReturnType<typeof requestRemoveSeats> = yield call(
      requestRemoveSeats,
      action.payload,
    );
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setSubscriptionInfoError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleBillingPeriodChange(
  action: PayloadAction<{ period: 'MONTH' | 'YEAR' }>,
) {
  try {
    const response: SagaReturnType<typeof requestBillingPeriodChange> =
      yield call(requestBillingPeriodChange, action.payload);
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setSubscriptionInfoError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleCancelSubscription(_action: PayloadAction) {
  try {
    const response: SagaReturnType<typeof requestCancelSubscription> =
      yield call(requestCancelSubscription);
    yield put(setSubscriptionInfo(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      showErrorNotification(
        error.response?.data.message ?? errorResponse.message,
      ),
    );
    yield put(
      setSubscriptionInfoError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

export function* cancelSubscriptionWatcher() {
  yield takeLatest(dispatchCancelSubcription.type, handleCancelSubscription);
}

export function* billingPeriodChangeWatcher() {
  yield takeLatest(dispatchChangeBillingPeriod.type, handleBillingPeriodChange);
}

export function* removeSeatsWatcher() {
  yield takeLatest(dispatchRemoveSeats.type, handleRemoveSeats);
}

export function* purchaseSeatsWatcher() {
  yield takeLatest(dispatchPurchaseSeats.type, handlePurchaseSeats);
}

export function* setPaymentMethodAsDefaultWatcher() {
  yield takeLatest(
    dispatchSetPaymentMethodAsDefault.type,
    handleSetPaymentMethodAsDefault,
  );
}

export function* deletePaymentMethodWatcher() {
  yield takeLatest(dispatchDeletePaymentMethod.type, handleDeletePaymentMethod);
}

export function* addPaymentMethodWatcher() {
  yield takeLatest(dispatchAddNewPaymentMethod.type, handleAddPaymentMethod);
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
