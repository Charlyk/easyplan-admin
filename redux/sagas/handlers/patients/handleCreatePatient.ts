import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  dispatchCreatePatient,
  addNewPatient,
} from 'redux/slices/patientsListSlice';
import { CreatePatientRequest } from 'types/api';
import { requestCreatePatient } from '../../requests';

export function* handleCreatePatient(
  action: PayloadAction<CreatePatientRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestCreatePatient> = yield call(
      requestCreatePatient,
      action.payload,
    );
    yield put(addNewPatient(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* createPatientWatcher() {
  yield takeLatest(dispatchCreatePatient.type, handleCreatePatient);
}
