import { SagaReturnType } from '@redux-saga/core/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  setError,
  setServicesData,
  fetchServicesList,
} from 'redux/slices/servicesListSlice';
import { requestFetchServicesList } from '../requests';

export function* handleFetchClinicServices() {
  try {
    const response: SagaReturnType<typeof requestFetchServicesList> =
      yield call(requestFetchServicesList);
    yield put(setServicesData(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(setError(data?.message ?? error.message));
    } else {
      yield put(setError(error.message));
    }
  }
}

export function* clinicServicesWatcher() {
  yield takeLatest(fetchServicesList.type, handleFetchClinicServices);
}
