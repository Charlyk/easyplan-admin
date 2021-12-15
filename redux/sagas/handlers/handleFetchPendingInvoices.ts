import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchInvoicesList,
  setInvoicesList,
} from 'app/components/dashboard/InvoicesButton/InvoicesButton.slice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchPendingInvoices } from '../requests';

export function* handleFetchPendingInvoices() {
  try {
    const response = yield call(requestFetchPendingInvoices);
    yield put(setInvoicesList(response.data));
  } catch (error) {
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
