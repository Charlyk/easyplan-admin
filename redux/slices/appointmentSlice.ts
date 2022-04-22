import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import {
  AppointmentsDoctorsResponse,
  AppointmentServiceResponse,
  CalendarSchedulesResponse,
} from 'types/api';

const appointmentsModalSlice = createSlice({
  name: 'appointments',
  initialState: initialState.appointments,
  reducers: {
    openAppointmentModal(state) {
      state.modalProps.open = true;
    },

    dispatchFetchDoctors(state) {
      state.doctors.loading = true;
    },
    dispatchFetchServices(
      state,
      _action: PayloadAction<{ doctorId: string | number }>,
    ) {
      state.services.loading = true;
    },
    dispatchFetchStartHours(
      state,
      _action: PayloadAction<{
        doctorId: string;
        date: string;
        step?: string;
      }>,
    ) {
      state.startHours.loading = true;
    },
    dispatchFetchEndHours(
      state,
      _action: PayloadAction<{
        doctorId: string;
        date: string;
        step?: string;
        serviceId: string;
        startTime: string;
      }>,
    ) {
      state.endHours.loading = true;
    },
    dispatchFetchAppointmentSchedules(
      state,
      _action: PayloadAction<{ start: string; end: string; doctorId: string }>,
    ) {
      state.schedules.loading = true;
    },
    setAppointmentSchedules(
      state,
      action: PayloadAction<CalendarSchedulesResponse>,
    ) {
      state.schedules.loading = false;
      state.schedules.data = action.payload;
    },
    setAppointmentSchedulesError(state, action: PayloadAction<string | null>) {
      state.schedules.loading = false;
      state.schedules.error = action.payload;
    },
    setEndHours(state, action: PayloadAction<string[]>) {
      state.endHours.loading = false;
      state.endHours.data = action.payload;
    },
    setEndHoursError(state, action: PayloadAction<string | null>) {
      state.endHours.loading = false;
      state.endHours.error = action.payload;
    },
    setStartHours(state, action: PayloadAction<string[]>) {
      state.startHours.loading = false;
      state.startHours.data = action.payload;
    },
    setStartHoursError(state, action: PayloadAction<string | null>) {
      state.startHours.loading = false;
      state.startHours.error = action.payload;
    },
    setAppointmentServices(
      state,
      action: PayloadAction<AppointmentServiceResponse[]>,
    ) {
      state.services.data = action.payload;
      state.services.loading = false;
    },
    setAppointmentServicesError(state, action: PayloadAction<string | null>) {
      state.services.error = action.payload;
      state.services.loading = false;
    },
    setAppointmentDoctors(
      state,
      action: PayloadAction<AppointmentsDoctorsResponse[]>,
    ) {
      state.doctors.data = action.payload;
      state.doctors.loading = false;
    },
    setAppointmentDoctorsError(state, action: PayloadAction<string | null>) {
      state.doctors.error = action.payload;
      state.doctors.loading = false;
    },
    closeAppointmentModal(state) {
      state.modalProps.open = false;
    },
    setAppointmentFormKeyValue(
      state,
      action: PayloadAction<{
        key: keyof typeof initialState.appointments.formData;
        value: number | string | boolean;
      }>,
    ) {
      const { key, value } = action.payload;

      state.formData = {
        ...state.formData,
        [key]: value,
      };

      const shouldEraseErrors =
        key === 'date' ||
        key === 'startHour' ||
        key === 'endHour' ||
        key === 'doctorId';

      if (shouldEraseErrors) {
        state.startHours.error = null;
        state.endHours.error = null;
      }
    },
    setAppointmentFormData(
      state,
      action: PayloadAction<typeof initialState.appointments.formData>,
    ) {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    setSelectedDate(state, action: PayloadAction<string | Date>) {
      state.selectedDate = action.payload;
    },
    openAppointmentModalWithTimeSet(
      state,
      action: PayloadAction<{ startHour: string; selectedDate: string | Date }>,
    ) {
      state.modalProps.open = true;
      state.formData.startHour = action.payload.startHour;
      state.selectedDate = action.payload.selectedDate;
    },
    openNewPatientsModal(state) {
      state.newPatientsModalOpen = true;
    },
    closeNewPatientsModal(state) {
      state.newPatientsModalOpen = false;
    },
    resetAppointmentsState() {
      return initialState.appointments;
    },
  },
});

export const {
  openAppointmentModal,
  closeAppointmentModal,
  setSelectedDate,
  setAppointmentFormKeyValue,
  openAppointmentModalWithTimeSet,
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
  resetAppointmentsState,
  setAppointmentFormData,
  openNewPatientsModal,
  closeNewPatientsModal,
  dispatchFetchAppointmentSchedules,
  setAppointmentSchedules,
  setAppointmentSchedulesError,
} = appointmentsModalSlice.actions;

export default appointmentsModalSlice.reducer;
