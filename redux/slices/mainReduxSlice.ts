import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientCallRecord } from 'types';
import initialState from '../initialState';

const mainReduxSlice = createSlice({
  name: 'main',
  initialState: initialState,
  reducers: {
    updateInvoices(state) {
      state.updateInvoices = !state.updateInvoices;
    },
    checkDoctorAppointments(state) {
      state.checkDoctorAppointments = !state.checkDoctorAppointments;
    },
    updateCategoriesList(state) {
      state.updateCategories = !state.updateCategories;
    },
    updateServicesList(state) {
      state.updateServices = !state.updateServices;
    },
    updateUsersList(state) {
      state.updateUsers = !state.updateUsers;
    },
    updateXRay(state) {
      state.updateXRay = !state.updateXRay;
    },
    updateNotes(state) {
      state.updateNotes = !state.updateNotes;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    changeCurrentClinic(state, action: PayloadAction<any>) {
      state.newClinicId = action.payload;
    },
    triggerUserLogOut(state, action: PayloadAction<boolean>) {
      state.logout = action.payload;
    },
    forceUserLogout(state, action: PayloadAction<boolean>) {
      state.forceLogout = action.payload;
    },
    updateAppointmentsList(state) {
      state.updateAppointments = !state.updateAppointments;
    },
    updateCalendarDoctorHeight(state) {
      state.updateCalendarDoctorHeight = !state.updateCalendarDoctorHeight;
    },
    setPatientDetails(state, action: PayloadAction<any>) {
      state.patientDetails = action.payload;
    },
    toggleUpdatePatients(state, action: PayloadAction<boolean>) {
      state.updatePatients = action.payload;
    },
    toggleUpdatePatientPayments(state) {
      state.updatePatientPayments = !state.updatePatientPayments;
    },
    toggleImportModal(state, action: PayloadAction<boolean>) {
      state.isImportModalOpen = action.payload;
    },
    toggleExchangeRateUpdate(state) {
      state.updateExchangeRates = !state.updateExchangeRates;
    },
    updateDoctorAppointment(state) {
      state.updateDoctorAppointments = !state.updateDoctorAppointments;
    },
    setUpdateHourIndicatorPosition(state) {
      state.updateHourIndicatorTop = !state.updateHourIndicatorTop;
    },
    playPhoneCallRecord(
      state,
      action: PayloadAction<PatientCallRecord | null>,
    ) {
      state.callToPlay = action.payload;
    },
  },
});

export const {
  changeCurrentClinic,
  checkDoctorAppointments,
  updateCalendarDoctorHeight,
  updateCategoriesList,
  forceUserLogout,
  setUpdateHourIndicatorPosition,
  toggleExchangeRateUpdate,
  updateServicesList,
  updateDoctorAppointment,
  updateInvoices,
  setPatientDetails,
  setUser,
  toggleUpdatePatientPayments,
  toggleUpdatePatients,
  updateAppointmentsList,
  triggerUserLogOut,
  updateUsersList,
  updateNotes,
  updateXRay,
  toggleImportModal,
  playPhoneCallRecord,
} = mainReduxSlice.actions;

export default mainReduxSlice.reducer;
