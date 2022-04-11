import {
  call,
  put,
  SagaReturnType,
  takeLatest,
} from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchDoctors,
  fetchAppointmentServices,
  fetchAppointmentStartHours,
  fetchAppointmentEndHours,
  fetchSchedulesByInterval,
  postCreateNewAppointment,
  createAppointmentPatient,
} from 'redux/sagas/requests/appointments/appointments';
import {
  dispatchFetchDoctors,
  setAppointmentDoctors,
  setAppointmentDoctorsError,
  dispatchFetchServices,
  setAppointmentServices,
  setAppointmentServicesError,
  dispatchFetchStartHours,
  setStartHours,
  setStartHoursError,
  dispatchFetchEndHours,
  setEndHours,
  setEndHoursError,
  setAppointmentSchedules,
  setAppointmentSchedulesError,
  dispatchFetchAppointmentSchedules,
  closeAppointmentModal,
  resetAppointmentsState,
  closeNewPatientsModal,
  setAppointmentFormKeyValue,
} from 'redux/slices/appointmentSlice';
import {
  addNewSchedule,
  dispatchCreateAppointment,
} from 'redux/slices/calendarData';
import {
  setSearchedPatients,
  setPaientsErrorMessage,
} from 'redux/slices/patientsAutocompleteSlice';
import { dispatchCreateAppointmentPatient } from 'redux/slices/patientsSlice';
import {
  ErrorResponse,
  CreateAppointmentType,
  CreatePatientBody,
} from 'types/api';

function* handleFetchAppointmentSchedules(
  action: PayloadAction<{ start: string; end: string; doctorId: string }>,
) {
  try {
    const response: SagaReturnType<typeof fetchSchedulesByInterval> =
      yield call(fetchSchedulesByInterval, action.payload);

    yield put(setAppointmentSchedules(response.data));
  } catch (err) {
    const errorResponse = err as ErrorResponse;
    yield put(
      setAppointmentSchedulesError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleCreateAppointment(
  action: PayloadAction<CreateAppointmentType>,
) {
  try {
    const response: SagaReturnType<typeof postCreateNewAppointment> =
      yield call(postCreateNewAppointment, action.payload);
    yield put(addNewSchedule(response.data));
    yield put(closeAppointmentModal());
    yield put(resetAppointmentsState());
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(errorResponse.message);
  }
}

function* handleFetchDoctors() {
  try {
    const response: SagaReturnType<typeof fetchDoctors> = yield call(
      fetchDoctors,
    );
    yield put(setAppointmentDoctors(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setAppointmentDoctorsError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleFetchServices(action: PayloadAction<{ doctorId: string }>) {
  try {
    const response: SagaReturnType<typeof fetchAppointmentServices> =
      yield call(fetchAppointmentServices, action.payload);
    yield put(setAppointmentServices(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setAppointmentServicesError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleFetchStartHours(
  action: PayloadAction<{ doctorId: string; date: string; serviceId: string }>,
) {
  try {
    const response: SagaReturnType<typeof fetchAppointmentStartHours> =
      yield call(fetchAppointmentStartHours, action.payload);
    yield put(setStartHours(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setStartHoursError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleFetchEndHours(
  action: PayloadAction<{
    doctorId: string;
    date: string;
    serviceId: string;
    startTime: string;
  }>,
) {
  try {
    const response: SagaReturnType<typeof fetchAppointmentStartHours> =
      yield call(fetchAppointmentEndHours, action.payload);
    yield put(setEndHours(response.data));
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setEndHoursError(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

function* handleCreatePatient(action: PayloadAction<CreatePatientBody>) {
  try {
    const response: SagaReturnType<typeof createAppointmentPatient> =
      yield call(createAppointmentPatient, action.payload);
    if (response.data === null || response.data === undefined) return;
    yield put(setSearchedPatients([response.data]));
    yield put(
      setAppointmentFormKeyValue({ key: 'patientId', value: response.data.id }),
    );
    yield put(closeNewPatientsModal());
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    yield put(
      setPaientsErrorMessage(
        errorResponse.response?.data.message ?? errorResponse.message,
      ),
    );
  }
}

export function* createAppointmentPatientWatcher() {
  yield takeLatest(dispatchCreateAppointmentPatient.type, handleCreatePatient);
}

export function* fetchAppointmentSchedulesWatcher() {
  yield takeLatest(
    dispatchFetchAppointmentSchedules.type,
    handleFetchAppointmentSchedules,
  );
}

export function* createNewAppointmentWatcher() {
  yield takeLatest(dispatchCreateAppointment.type, handleCreateAppointment);
}

export function* fetchAppointmentEndHoursWatcher() {
  yield takeLatest(dispatchFetchEndHours.type, handleFetchEndHours);
}

export function* fetchAppointmentStartHoursWatcher() {
  yield takeLatest(dispatchFetchStartHours.type, handleFetchStartHours);
}

export function* fetchAppointmentServicesWatcher() {
  yield takeLatest(dispatchFetchServices.type, handleFetchServices);
}

export function* fetchAppointmentDoctorsWatcher() {
  yield takeLatest(dispatchFetchDoctors.type, handleFetchDoctors);
}
