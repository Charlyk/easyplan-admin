import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchPatientVisits,
  setIsFetching,
  setPatientVisits,
} from 'app/components/dashboard/patients/PatientDetailsModal/AppointmentNotes/AppointmentNotes.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchPatientVisits } from '../../requests';

export function* handleFetchPatientVisits(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestFetchPatientVisits> =
      yield call(requestFetchPatientVisits, action.payload);
    yield put(setPatientVisits(response.data));
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

export function* patientVisitsWatcher() {
  yield takeLatest(dispatchFetchPatientVisits.type, handleFetchPatientVisits);
}
