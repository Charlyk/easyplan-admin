import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchDeleteDealState,
  removeDealState,
  setIsFetchingStates,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestDeleteDealState } from '../../requests';

export function* handleDeleteDealState(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestDeleteDealState> = yield call(
      requestDeleteDealState,
      action.payload,
    );
    yield put(removeDealState(response.data));
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

export function* deleteDealStateWatcher() {
  yield takeLatest(dispatchDeleteDealState.type, handleDeleteDealState);
}
