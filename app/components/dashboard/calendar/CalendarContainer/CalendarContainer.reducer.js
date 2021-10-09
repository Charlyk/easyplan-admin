import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  filters: { doctors: [], services: [] },
  selectedService: null,
  selectedDoctor: null,
  appointmentModal: { open: false },
  isFetching: false,
  viewDate: new Date(),
  deleteSchedule: { open: false, schedule: null },
  isDeleting: false,
  viewMode: 'day',
  showImportModal: false,
  setupExcelModal: { open: false, data: null },
  isUploading: false,
  importData: {
    fileUrl: null,
    fileName: null,
    cellTypes: [],
    doctors: [],
    services: [],
  },
  isParsing: false,
  parsedValue: 0,
};

const calendarContainerSlice = createSlice({
  name: 'calendarContainer',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setSelectedService(state, action) {
      state.selectedService = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
      state.selectedSchedule = null;
    },
    setViewDate(state, action) {
      state.viewDate = action.payload;
      state.selectedSchedule = null;
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    },
    setSelectedSchedule(state, action) {
      state.selectedSchedule = action.payload;
    },
    setDeleteSchedule(state, action) {
      state.deleteSchedule = action.payload;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
      state.selectedSchedule = null;
    },
    setShowImportModal(state, action) {
      state.showImportModal = action.payload;
    },
    setSetupExcelModal(state, action) {
      state.setupExcelModal = action.payload;
    },
    setIsUploading(state, action) {
      state.isUploading = action.payload;
    },
    setImportData(state, action) {
      state.importData = { ...state.importData, ...action.payload };
    },
    setParsedValue(state, action) {
      state.parsedValue = action.payload;
    },
    setIsParsing(state, action) {
      state.isParsing = action.payload;
    },
  },
});

export const {
  setIsUploading,
  setParsedValue,
  setShowImportModal,
  setFilters,
  setSelectedDoctor,
  setIsDeleting,
  setIsFetching,
  setIsParsing,
  setSelectedSchedule,
  setViewDate,
  setViewMode,
  setDeleteSchedule,
} = calendarContainerSlice.actions;

export default calendarContainerSlice.reducer;
