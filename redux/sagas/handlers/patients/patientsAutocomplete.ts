import {
  call,
  put,
  SagaReturnType,
  takeLatest,
} from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  dispatchFetchFilteredPatients,
  setSearchedPatients,
  setPaientsErrorMessage,
} from 'redux/slices/patientsAutocompleteSlice';
import { ErrorResponse } from 'types/api';
import { requestFilteredPatients } from '../../requests';

function* handleFilteredFetchPatients(action: PayloadAction<string>) {
  try {
    const response: SagaReturnType<typeof requestFilteredPatients> = yield call(
      requestFilteredPatients,
      action.payload,
    );
    yield put(setSearchedPatients(response.data.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setPaientsErrorMessage(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

export function* fetchFilteredPatientsWatcher() {
  yield takeLatest(
    dispatchFetchFilteredPatients.type,
    handleFilteredFetchPatients,
  );
}
