import {
  call,
  put,
  SagaReturnType,
  takeLatest,
} from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { updateUserAccount } from 'redux/sagas/requests/users';
import {
  dispatchUpdateUserLanguage,
  setNewAppLanguage,
} from 'redux/slices/appDataSlice';
import { AppLocale } from 'types';
import { ErrorResponse } from 'types/api';

function* handleUpdateUserLanguage(action: PayloadAction<AppLocale>) {
  try {
    const response: SagaReturnType<typeof updateUserAccount> = yield call(
      updateUserAccount,
      { language: action.payload },
    );
    yield put(setNewAppLanguage(response.data.language));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(errorResponse);
  }
}

export function* updateUserLanguageWatcher() {
  yield takeLatest(dispatchUpdateUserLanguage.type, handleUpdateUserLanguage);
}
