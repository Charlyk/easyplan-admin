import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { textForKey } from 'app/utils/localization';
import {
  updateUserProfile,
  setCurrentUser,
  setAuthToken,
  setIsUpdatingProfile,
} from 'redux/slices/appDataSlice';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'redux/slices/globalNotificationsSlice';
import { UpdateProfileRequest } from 'types/api';
import { requestUpdateUserProfile } from '../requests';

export function* handleUpdateUserProfile(
  action: PayloadAction<UpdateProfileRequest>,
) {
  try {
    const { data }: SagaReturnType<typeof requestUpdateUserProfile> =
      yield call(requestUpdateUserProfile, action.payload);
    yield put(setCurrentUser(data.user));
    yield put(setAuthToken(data.token));
    yield put(showSuccessNotification(textForKey('Saved successfully')));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  } finally {
    yield put(setIsUpdatingProfile(false));
  }
}

export function* updateProfileWatcher() {
  yield takeLatest(updateUserProfile.type, handleUpdateUserProfile);
}
