import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchFetchConnectionInfo,
  setIsLoading,
  setMoizvonkiConnection,
} from 'app/components/dashboard/settings/CrmSettings/Integrations/MoizvonkiIntegration/MoizvonkiIntegration.reducer';
import { requestFetchMoizvonkiConnection } from '../../requests';

export function* handleFetchMoizvonkiConnection() {
  try {
    const response: SagaReturnType<typeof requestFetchMoizvonkiConnection> =
      yield call(requestFetchMoizvonkiConnection);
    yield put(setMoizvonkiConnection(response.data));
  } catch (error) {
    yield put(setIsLoading(false));
  }
}

export function* moizvonkiConnectionWatcher() {
  yield takeLatest(
    dispatchFetchConnectionInfo.type,
    handleFetchMoizvonkiConnection,
  );
}
