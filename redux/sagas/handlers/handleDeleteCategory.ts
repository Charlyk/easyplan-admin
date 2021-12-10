import { SagaReturnType } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import {
  deleteCategory,
  fetchDeletedCategory,
} from 'redux/slices/servicesListSlice';
import { requestDeleteCategory } from '../requests';

export function* handleDeleteCategories(action: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof requestDeleteCategory> = yield call(
      requestDeleteCategory,
      action.payload,
    );

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

export function* deleteCategoriesWatcher() {
  yield takeLatest(fetchDeletedCategory.type, handleDeleteCategories);
}
