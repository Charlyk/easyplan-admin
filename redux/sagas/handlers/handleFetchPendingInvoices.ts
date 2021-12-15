import { SagaReturnType } from '@redux-saga/core/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchInvoicesList,
  setInvoicesList,
  setIsLoading,
} from 'app/components/dashboard/InvoicesButton/InvoicesButton.slice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchPendingInvoices } from '../requests';

export function* handleFetchPendingInvoices() {
  try {
    const response: SagaReturnType<typeof requestFetchPendingInvoices> =
      yield call(requestFetchPendingInvoices);
    yield put(setInvoicesList(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* pendingInvoicesWatcher() {
  yield takeLatest(fetchInvoicesList.type, handleFetchPendingInvoices);
}
