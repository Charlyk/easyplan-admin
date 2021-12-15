import { SagaReturnType, call, put, takeLatest } from 'redux-saga/effects';
import { requestFetchPatientList } from 'redux/sagas/requests/patients/patientListRequest';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { setPatients, fetchPatientList } from 'redux/slices/patientsListSlice';
import { PayloadAction } from '@reduxjs/toolkit';

export function* handleFetchPatientList(
  action: PayloadAction<{
    query: Record<string, string>;
  }>,
) {
  try {
    const response: SagaReturnType<typeof requestFetchPatientList> = yield call(
      requestFetchPatientList,
      action.payload.query,
    );

    yield put(setPatients(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* patientListWatcher() {
  yield takeLatest(fetchPatientList.type, handleFetchPatientList);
}
