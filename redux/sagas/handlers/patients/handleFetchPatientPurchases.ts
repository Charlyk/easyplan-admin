import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchPatientPurchases,
  setPayments,
  setIsLoading,
} from 'app/components/dashboard/patients/PatientDetailsModal/PatientPurchasesList/PatientPurchasesList.reducer';
import { requestFetchPatientPurchases } from 'redux/sagas/requests';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';

export function* handleFetchPatientPurchases(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestFetchPatientPurchases> =
      yield call(requestFetchPatientPurchases, action.payload);
    yield put(setPayments(response.data));
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

export function* patientPurchasesWatcher() {
  yield takeLatest(
    dispatchFetchPatientPurchases.type,
    handleFetchPatientPurchases,
  );
}
