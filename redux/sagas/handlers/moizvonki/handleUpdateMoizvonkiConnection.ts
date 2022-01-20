import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchUpdateConnection,
  setIsLoading,
  setMoizvonkiConnection,
} from 'app/components/dashboard/settings/CrmSettings/Integrations/MoizvonkiIntegration/MoizvonkiIntegration.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { ConnectMoizvonkiRequest } from 'types/api';
import { requestUpdateMoizvonkiConnection } from '../../requests';

export function* handleUpdateMoizvonkiConnection(
  action: PayloadAction<ConnectMoizvonkiRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdateMoizvonkiConnection> =
      yield call(requestUpdateMoizvonkiConnection, action.payload);
    yield put(setMoizvonkiConnection(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateMoizvonkiConnectionWatcher() {
  yield takeLatest(
    dispatchUpdateConnection.type,
    handleUpdateMoizvonkiConnection,
  );
}
