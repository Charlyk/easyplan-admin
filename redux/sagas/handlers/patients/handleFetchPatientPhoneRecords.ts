import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchCallRecords,
  dispatchUpdateCallRecords,
  setCallRecords,
  setIsFetching,
  updateCallRecords,
} from 'app/components/dashboard/patients/PatientDetailsModal/PatientPhoneRecords/PatientPhoneRecords.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  PatientPhoneRecordsRequest,
  UpdatePatientPhonePayload,
} from 'types/api';
import {
  requestFetchPatientPhoneRecords,
  requestUpdatePatientPhoneRecords,
} from '../../requests';

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

export function* handleUpdatePatientPhoneRecords(
  action: PayloadAction<UpdatePatientPhonePayload>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdatePatientPhoneRecords> =
      yield call(requestUpdatePatientPhoneRecords, action.payload);

    yield put(updateCallRecords(response.data));
  } catch (error) {
    yield put(
      showErrorNotification(error?.response?.data?.message ?? error?.message),
    );
  }
}

export function* updatePatientPhoneRecordWatcher() {
  yield takeLatest(
    dispatchUpdateCallRecords.type,
    handleUpdatePatientPhoneRecords,
  );
}

export function* patientCallRecordsWatcher() {
  yield takeLatest(
    dispatchFetchCallRecords.type,
    handleFetchPatientPhoneRecords,
  );
}
