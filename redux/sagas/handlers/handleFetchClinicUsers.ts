import { SagaReturnType } from '@redux-saga/core/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { setUsersData, fetchClinicUsers } from 'redux/slices/usersListSlice';
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
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* clinicUsersWatcher() {
  yield takeLatest(fetchClinicUsers.type, handleFetchClinicUsers);
}
