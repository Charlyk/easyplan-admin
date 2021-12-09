import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchScheduleDetails,
  setAppointmentDetails,
} from 'redux/slices/calendarData';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { fetchScheduleDetails as requestScheduleDetails } from '../requests';

export function* handleFetchScheduleDetails(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestScheduleDetails> = yield call(
      requestScheduleDetails,
      action.payload,
    );
    yield put(setAppointmentDetails(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* scheduleDetailsWatcher() {
  yield takeLatest(fetchScheduleDetails.type, handleFetchScheduleDetails);
}
