import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchCreateNewReminder,
  setIsLoading,
  setNewReminder,
} from 'redux/slices/CreateReminderModal.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { CreateReminderRequest } from 'types/api';
import { requestCreateNewReminder } from '../../requests';

export function* handleCreateNewReminder(
  action: PayloadAction<CreateReminderRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestCreateNewReminder> =
      yield call(requestCreateNewReminder, action.payload);
    yield put(setNewReminder(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* createNewReminderWatcher() {
  yield takeLatest(dispatchCreateNewReminder.type, handleCreateNewReminder);
}
