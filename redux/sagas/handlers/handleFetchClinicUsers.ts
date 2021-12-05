import { SagaReturnType } from '@redux-saga/core/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  setError,
  setUsersData,
  fetchClinicUsers,
} from 'redux/slices/usersListSlice';
import { fetchClinicUsers as requestFetchClinicUsers } from '../requests';

export function* handleFetchClinicUsers() {
  try {
    const response: SagaReturnType<typeof requestFetchClinicUsers> = yield call(
      requestFetchClinicUsers,
    );
    const { users, invitations } = response.data;
    yield put(setUsersData({ users, invitations }));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(setError(data?.message ?? error.message));
    } else {
      yield put(setError(error.message));
    }
  }
}

export function* clinicUsersWatcher() {
  yield takeLatest(fetchClinicUsers.type, handleFetchClinicUsers);
}
