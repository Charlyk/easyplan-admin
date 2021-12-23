import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchCallRecords,
  setCallRecords,
  setIsFetching,
} from 'app/components/dashboard/patients/PatientDetailsModal/PatientPhoneRecords/PatientPhoneRecords.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { PatientPhoneRecordsRequest } from 'types/api';
import { requestFetchPatientPhoneRecords } from '../../requests';

export function* handleFetchPatientPhoneRecords(
  action: PayloadAction<PatientPhoneRecordsRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestFetchPatientPhoneRecords> =
      yield call(
        requestFetchPatientPhoneRecords,
        action.payload.patientId,
        action.payload.page,
      );
    yield put(setCallRecords(response.data));
  } catch (error) {
    yield put(setIsFetching(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* patientCallRecordsWatcher() {
  yield takeLatest(
    dispatchFetchCallRecords.type,
    handleFetchPatientPhoneRecords,
  );
}
