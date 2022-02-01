import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  addDealState,
  dispatchCreateDealState,
  dispatchFetchDealStates,
  setIsFetchingStates,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { CreateDealStateRequest } from 'types/api';
import { requestCreateDealState } from '../../requests';

export function* handleCreateDealState(
  action: PayloadAction<CreateDealStateRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestCreateDealState> = yield call(
      requestCreateDealState,
      action.payload,
    );
    yield put(addDealState(response.data));
    yield put(dispatchFetchDealStates(false));
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

export function* createDealStateWatcher() {
  yield takeLatest(dispatchCreateDealState.type, handleCreateDealState);
}
