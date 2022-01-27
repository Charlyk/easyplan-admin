import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchUpdateDealState,
  setIsFetchingStates,
  updateDealState,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { UpdateDealStateRequest } from 'types/api';
import { requestUpdateDealState } from '../../requests';

export function* handleUpdateDealState(
  action: PayloadAction<{ stateId: number; body: UpdateDealStateRequest }>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdateDealState> = yield call(
      requestUpdateDealState,
      action.payload.stateId,
      action.payload.body,
    );
    yield put(updateDealState(response.data));
  } catch (error) {
    yield put(setIsFetchingStates(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateDealStateWatcher() {
  yield takeLatest(dispatchUpdateDealState.type, handleUpdateDealState);
}
