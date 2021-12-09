import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  updateUserProfile,
  setCurrentUser,
  setAuthToken,
  setIsUpdatingProfile,
} from 'redux/slices/appDataSlice';
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
  } catch (error) {
    console.error(error);
  } finally {
    yield put(setIsUpdatingProfile(false));
  }
}

export function* updateProfileWatcher() {
  yield takeLatest(updateUserProfile.type, handleUpdateUserProfile);
}
