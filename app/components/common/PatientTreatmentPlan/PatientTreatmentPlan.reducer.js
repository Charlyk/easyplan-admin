import { createSlice } from '@reduxjs/toolkit';

import {
  getServicesData,
  getScheduleDetails,
} from './PatientTreatmentPlan.utils';

export const initialState = {
  isLoading: false,
  patient: null,
  toothServices: [],
  allServices: [],
  bracesServices: [],
  selectedServices: [],
  completedServices: [],
  schedule: null,
  shouldFillTreatmentPlan: null,
  treatmentPlan: null,
  showFinalizeTreatment: false,
  isFinalizing: false,
  teethModal: { open: false, service: null },
};

const treatmentPlanSlice = createSlice({
  name: 'patientTreatmentPlan',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setPatient(state, action) {
      state.patient = action.payload;
    },
    setToothServices(state, action) {
      state.toothServices = action.payload;
    },
    setAllServices(state, action) {
      state.allServices = action.payload;
    },
    setSelectedServices(state, action) {
      const { services } = action.payload;
      state.selectedServices = services.map((item) => ({
        ...item,
      }));
      state.servicesFieldValue = '';
    },
    setSchedule(state, action) {
      state.schedule = action.payload;
    },
    setShouldFillTreatmentPlan(state, action) {
      state.shouldFillTreatmentPlan = action.payload;
    },
    setShowFinalizeTreatment(state, action) {
      state.showFinalizeTreatment = action.paylod;
    },
    setIsFinalizing(state, action) {
      state.isFinalizing = action.payload;
    },
    setServices(state, action) {
      const { allServices, toothServices, bracesServices } = getServicesData(
        action.payload,
      );
      state.allServices = allServices;
      state.toothServices = toothServices;
      state.bracesServices = bracesServices;
    },
    setScheduleDetails(state, action) {
      const { data, clinicCurrency } = action.payload;
      const { patient, schedule, selectedServices, completedServices } =
        getScheduleDetails(data, clinicCurrency, state);

      state.patient = patient;
      state.schedule = schedule;
      state.selectedServices = selectedServices;
      state.completedServices = completedServices;
    },
    setInitialData(state, action) {
      const { schedule: schedulePayload, currency, services } = action.payload;
      const { patient, schedule, selectedServices, completedServices } =
        getScheduleDetails(schedulePayload, currency, state);
      const { allServices, toothServices, bracesServices } =
        getServicesData(services);

      state.patient = patient;
      state.schedule = schedule;
      state.selectedServices = selectedServices;
      state.completedServices = completedServices;
      state.allServices = allServices;
      state.toothServices = toothServices;
      state.bracesServices = bracesServices;
    },
    setTeethModal(state, action) {
      const { open } = action.payload;
      if (!open) {
        state.teethModal = { open: false, service: null };
      } else {
        state.teethModal = action.payload;
      }
    },
  },
});

export const {
  setAllServices,
  setServices,
  setPatient,
  setSchedule,
  setShouldFillTreatmentPlan,
  setShowFinalizeTreatment,
  setIsLoading,
  setInitialData,
  setSelectedServices,
  setToothServices,
  setIsFinalizing,
  setScheduleDetails,
  setTeethModal,
} = treatmentPlanSlice.actions;

export default treatmentPlanSlice.reducer;
