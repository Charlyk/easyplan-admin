import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  setClinicSettings,
  dispatchUpdateConfirmationDoctor,
} from 'app/components/dashboard/settings/ApplicationSettings/ClinicSettings/ClinicSettings.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestUpdateConfirmationDoctor } from '../../requests';

export function* handleUpdateConfirmationDoctor(
  action: PayloadAction<boolean>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdateConfirmationDoctor> =
      yield call(requestUpdateConfirmationDoctor, action.payload);
    yield put(setClinicSettings(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateConfirmationDoctorWatcher() {
  yield takeLatest(
    dispatchUpdateConfirmationDoctor.type,
    handleUpdateConfirmationDoctor,
  );
}
