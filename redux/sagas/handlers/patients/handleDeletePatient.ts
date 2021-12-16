import { PayloadAction } from '@reduxjs/toolkit';
import { SagaReturnType, call, put, takeLatest } from 'redux-saga/effects';
import { requestDeletePatient as sagaRequestDeletePatient } from 'redux/sagas/requests/patients/requestDeletePatient';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  deletePatient,
  requestDeletePatient,
} from 'redux/slices/patientsListSlice';

export function* handleDeletePatient(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof sagaRequestDeletePatient> =
      yield call(sagaRequestDeletePatient, action.payload);

    yield put(deletePatient(response.data.id));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* deletePatientWatcher() {
  yield takeLatest(requestDeletePatient.type, handleDeletePatient);
}
