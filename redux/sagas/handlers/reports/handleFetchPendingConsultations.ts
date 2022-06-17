import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  fetchPendingConsultations,
  setPendingConsultations,
} from 'redux/slices/pendingConsultationsSlice';
import { ErrorResponse, PendingConsultationsGetRequest } from 'types/api';
import { requestFetchPendingConsultations } from '../../requests';

function* handleFetchPendingConsultations(
  action: PayloadAction<PendingConsultationsGetRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestFetchPendingConsultations> =
      yield call(requestFetchPendingConsultations, action.payload);

    yield put(setPendingConsultations(response.data));
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

export function* pendingConsultationsWatcher() {
  yield takeLatest(
    fetchPendingConsultations.type,
    handleFetchPendingConsultations,
  );
}
