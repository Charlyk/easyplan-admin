import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import {
  dispatchUpdateVisit,
  updatePatientVisit,
} from 'app/components/dashboard/patients/PatientDetailsModal/AppointmentNotes/AppointmentNotes.reducer';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { UpdateVisitRequest } from 'types/api';
import { requestUpdateVisitNotes } from '../../requests';

export function* handleUpdateVisitNote(
  action: PayloadAction<UpdateVisitRequest>,
) {
  try {
    const response: SagaReturnType<typeof requestUpdateVisitNotes> = yield call(
      requestUpdateVisitNotes,
      action.payload,
    );
    yield put(updatePatientVisit(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateVisitNoteWatcher() {
  yield takeLatest(dispatchUpdateVisit, handleUpdateVisitNote);
}
