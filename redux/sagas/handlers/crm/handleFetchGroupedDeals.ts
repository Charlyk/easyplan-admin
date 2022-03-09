import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  addGroupedDeals,
  dispatchFetchGroupedDeals,
  setGroupedDeals,
  setIsFetchingDeals,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchGroupedDeals } from '../../requests';

export function* handleFetchGroupedDeals(
  action: PayloadAction<{ page: number; itemsPerPage: number }>,
) {
  try {
    const response: SagaReturnType<typeof requestFetchGroupedDeals> =
      yield call(
        requestFetchGroupedDeals,
        action.payload.page,
        action.payload.itemsPerPage,
      );
    if (action.payload.page > 0) {
      yield put(addGroupedDeals(response.data));
    } else {
      yield put(setGroupedDeals(response.data));
    }
  } catch (error) {
    yield put(setIsFetchingDeals(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* fetchGroupedDealsWatcher() {
  yield takeLatest(dispatchFetchGroupedDeals.type, handleFetchGroupedDeals);
}
