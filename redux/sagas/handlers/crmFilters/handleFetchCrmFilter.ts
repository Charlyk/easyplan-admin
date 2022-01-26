import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { dispatchFetchCrmFilter } from 'app/components/crm/CrmMain/CrmFilters/CrmFilters.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchCrmFilter } from '../../requests';

export function* handleFetchCrmFilter() {
  try {
    const response: SagaReturnType<typeof requestFetchCrmFilter> = yield call(
      requestFetchCrmFilter,
    );
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* fetchCrmFilterWatcher() {
  yield takeLatest(dispatchFetchCrmFilter.type, handleFetchCrmFilter);
}
