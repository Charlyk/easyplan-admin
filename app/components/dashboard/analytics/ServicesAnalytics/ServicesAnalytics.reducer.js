import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';

export const initialState = {
  selectedDoctor: { id: -1 },
  selectedDoctors: [{ id: -1, name: textForKey('All doctors') }],
  selectedService: { id: -1 },
  selectedServices: [{ id: -1, name: textForKey('All services') }],
  selectedStatus: { id: 'All' },
  selectedStatuses: [],
  statistics: [],
  doctors: [],
  services: [],
  isLoading: false,
  showRangePicker: false,
  urlParams: {},
  totalItems: 0,
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
  page: 0,
  rowsPerPage: 25,
};

const servicesAnalyticsSlice = createSlice({
  name: 'servicesAnalytics',
  initialState,
  reducers: {
    setSelectedDoctors(state, action) {
      state.selectedDoctors = action.payload;
    },
    addSelectedDoctor(state, action) {
      state.selectedDoctors = [...state.selectedDoctors, action.payload];
    },
    removeSelectedDoctor(state, action) {
      state.selectedDoctors = state.selectedDoctors.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    setSelectedServices(state, action) {
      state.selectedServices = action.payload;
    },
    addSelectedService(state, action) {
      state.selectedServices = [...state.selectedServices, action.payload];
    },
    removeSelectedService(state, action) {
      state.selectedServices = state.selectedServices.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    setSelectedStatuses(state, action) {
      state.selectedStatuses = action.payload;
    },
    addSelectedStatus(state, action) {
      state.selectedStatuses = [...state.selectedStatuses, action.payload];
    },
    removeSelectedStatus(state, action) {
      state.selectedStatuses = state.selectedStatuses.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setServices(state, action) {
      state.services = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setShowRangePicker(state, action) {
      state.showRangePicker = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },
    setStatistics(state, action) {
      state.statistics = action.payload.data;
      state.totalItems = action.payload.total;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
    },
    setSelectedService(state, action) {
      state.selectedService = action.payload;
    },
    setSelectedStatus(state, action) {
      state.selectedStatus = action.payload;
    },
    setInitialQuery(state, action) {
      const {
        page,
        rowsPerPage,
        status,
        doctorId,
        serviceId,
        fromDate,
        toDate,
      } = action.payload;
      state.page = page;
      state.rowsPerPage = rowsPerPage;
      state.selectedStatuses = [{ id: status }];
      state.selectedDoctors = [
        {
          id: parseInt(String(doctorId || -1)),
          name: textForKey('All doctors'),
        },
      ];
      state.selectedServices = [
        {
          id: parseInt(String(serviceId || -1)),
          name: textForKey('All services'),
        },
      ];
      state.dateRange = [moment(fromDate).toDate(), moment(toDate).toDate()];
    },
    setUrlParams(state, action) {
      const { doctorId, status, startDate, endDate } = action.payload;
      const fromDate = startDate
        ? moment(startDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().startOf('month').toDate();
      const toDate = endDate
        ? moment(endDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().endOf('month').toDate();
      state.selectedDoctors = [{ id: doctorId || -1 }];
      state.selectedStatus = [{ id: status || 'All' }];
      state.dateRange = [fromDate, toDate];
      state.params = action.payload;
    },
  },
});

export const {
  setSelectedDoctor,
  setSelectedDoctors,
  addSelectedDoctor,
  removeSelectedDoctor,
  setSelectedService,
  setSelectedServices,
  addSelectedService,
  removeSelectedService,
  setSelectedStatus,
  setSelectedStatuses,
  addSelectedStatus,
  removeSelectedStatus,
  setIsLoading,
  setDateRange,
  setDoctors,
  setInitialQuery,
  setPage,
  setRowsPerPage,
  setServices,
  setShowRangePicker,
  setStatistics,
  setUrlParams,
} = servicesAnalyticsSlice.actions;

export default servicesAnalyticsSlice.reducer;
