import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchUndoPayment,
  removePayments,
} from 'app/components/dashboard/patients/PatientDetailsModal/PatientPurchasesList/PatientPurchasesList.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestUndoInvoicePayments } from '../../requests';

export function* handleUndoInvoicePayments(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestUndoInvoicePayments> =
      yield call(requestUndoInvoicePayments, action.payload);
    yield put(removePayments(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* undoInvoicePaymentsWatcher() {
  yield takeLatest(dispatchUndoPayment.type, handleUndoInvoicePayments);
}
