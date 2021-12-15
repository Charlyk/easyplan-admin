import { SagaReturnType, call, put, takeLatest } from 'redux-saga/effects';
import { requestFetchPatientList } from 'redux/sagas/requests/patients/patientListRequest';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { setPatients, fetchPatientList } from 'redux/slices/patientsListSlice';

export function* handleFetchPatientList({
  payload: { query },
}: {
  payload: {
    query: Record<string, string>;
  };
}) {
  try {
    const response: SagaReturnType<typeof requestFetchPatientList> = yield call(
      requestFetchPatientList,
      query,
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
