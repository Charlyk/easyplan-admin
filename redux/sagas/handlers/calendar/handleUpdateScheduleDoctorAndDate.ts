import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { textForKey } from 'app/utils/localization';
import { requestUpdateScheduleDoctorAndDate } from 'redux/sagas/requests';
import {
  requestUpdateScheduleDateAndDoctor,
  deleteSchedule,
  addNewSchedule,
} from 'redux/slices/calendarData';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { Schedule } from 'types';

export function* handleUpdateScheduleDoctorAndDate(
  action: PayloadAction<{
    schedule: Schedule;
    body: {
      doctorId: number;
      startDate?: string;
      cabinetId?: number;
      doctorServices?: any[];
    };
  }>,
) {
  try {
    const { schedule, body } = action.payload;

    if (
      !body.doctorServices.some(
        (service) => service.serviceId === schedule.serviceId,
      )
    ) {
      throw new Error(
        textForKey('selected_doctor_does_not_provide_this_service'),
      );
    }
    yield put(deleteSchedule(schedule));
    const response: SagaReturnType<typeof requestUpdateScheduleDoctorAndDate> =
      yield call(requestUpdateScheduleDoctorAndDate, action.payload);
    yield put(addNewSchedule(response.data));
  } catch (error) {
    if (error.response != null) {
      const data = error.response?.data;
      yield put(showErrorNotification(data?.message ?? error.message));
    } else {
      yield put(showErrorNotification(error.message));
    }
  }
}

export function* updateScheduleDoctorAndDateWatcher() {
  yield takeLatest(
    requestUpdateScheduleDateAndDoctor.type,
    handleUpdateScheduleDoctorAndDate,
  );
}
