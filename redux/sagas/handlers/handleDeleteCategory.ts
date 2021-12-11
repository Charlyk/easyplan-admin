import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  deleteCategory,
  requestDeleteCategory,
} from 'redux/slices/servicesListSlice';
import { requestDeleteCategory as requestsRequestDeleteCategory } from '../requests';

export function* handleDeleteCategory(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestsRequestDeleteCategory> =
      yield call(requestsRequestDeleteCategory, action.payload);

    yield put(deleteCategory(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* deleteCategoryWatcher() {
  yield takeLatest(requestDeleteCategory.type, handleDeleteCategory);
}
