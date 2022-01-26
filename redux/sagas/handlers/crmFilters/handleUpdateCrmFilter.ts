import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchUpdateCrmFilter,
  setFilterLoading,
  setCrmFilter,
} from 'app/components/crm/CrmMain/CrmFilters/CrmFilters.reducer';
import { dispatchFetchDealStates } from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { SaveCrmFilterRequest } from 'types/api';
import { requestUpdateCrmFilter } from '../../requests';

export function* handleUpdateCrmFilter(
  action: PayloadAction<SaveCrmFilterRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdateCrmFilter> = yield call(
      requestUpdateCrmFilter,
      action.payload,
    );
    yield put(setCrmFilter(response.data));
    yield put(dispatchFetchDealStates(true));
  } catch (error) {
    yield put(setFilterLoading(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateCrmFilterWatcher() {
  yield takeLatest(dispatchUpdateCrmFilter.type, handleUpdateCrmFilter);
}
