import { SagaReturnType } from '@redux-saga/core/effects';
import sortBy from 'lodash/sortBy';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  setExchangeRates,
  setIsFetching,
  fetchExchangeRatesList,
} from 'app/components/common/MainComponent/ExchageRates/ExchangeRates.slice';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { requestFetchClinicExchangeRates } from '../requests';

export function* handleFetchExchangeRates() {
  try {
    const response: SagaReturnType<typeof requestFetchClinicExchangeRates> =
      yield call(requestFetchClinicExchangeRates);
    const sortedItems = sortBy(response.data, (item) => item.created);
    yield put(setExchangeRates(sortedItems));
  } catch (error) {
    yield put(setIsFetching(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* fetchExchangeRatesWatcher() {
  yield takeLatest(fetchExchangeRatesList.type, handleFetchExchangeRates);
}
