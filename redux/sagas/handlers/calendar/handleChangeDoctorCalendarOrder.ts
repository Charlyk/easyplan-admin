import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchChangeDoctorCalendarOrder,
  setCurrentUser,
} from 'redux/slices/appDataSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { DoctorCalendarOrderRequest } from 'types/api';
import { requestChangeDoctorCalendarOrder } from '../../requests';

export function* handleChangeDoctorCalendarOrder(
  action: PayloadAction<DoctorCalendarOrderRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestChangeDoctorCalendarOrder> =
      yield call(
        requestChangeDoctorCalendarOrder,
        action.payload.entityId,
        action.payload.direction,
        action.payload.type,
      );
    yield put(setCurrentUser(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* doctorCalendarOrderWatcher() {
  yield takeLatest(
    dispatchChangeDoctorCalendarOrder.type,
    handleChangeDoctorCalendarOrder,
  );
}
