import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { requestFetchDealStates } from 'redux/sagas/requests';
import {
  dispatchFetchDealStates,
  setDealStates,
  setIsFetchingStates,
} from 'redux/slices/crmBoardSlice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';

export function* handleFetchDealsStates() {
  try {
    const response: SagaReturnType<typeof requestFetchDealStates> = yield call(
      requestFetchDealStates,
    );
    yield put(setDealStates(response.data));
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

export function* dealsStatesWatcher() {
  yield takeLatest(dispatchFetchDealStates.type, handleFetchDealsStates);
}
