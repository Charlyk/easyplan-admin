import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  fetchAppointmentReports,
  setAppointmentReports,
} from 'redux/slices/appointmentsReportSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { ErrorResponse } from 'types/api';
import { AppointmentReportsPayload } from 'types/api/request/appointmentsRequest.types';
import { requestAppointmentReports } from '../../requests';

function* handleFetchPaymentReports(
  action: PayloadAction<AppointmentReportsPayload>,
) {
  try {
    const response: SagaReturnType<typeof requestAppointmentReports> =
      yield call(requestAppointmentReports, action.payload);

    yield put(setAppointmentReports(response.data));
  } catch (e) {
    const error = e as ErrorResponse;
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* paymentAppointmentReportsWatcher() {
  yield takeLatest(fetchAppointmentReports.type, handleFetchPaymentReports);
}
