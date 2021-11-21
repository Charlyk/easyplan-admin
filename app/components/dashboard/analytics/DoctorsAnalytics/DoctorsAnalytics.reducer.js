import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

export const initialState = {
  isLoading: false,
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  showRangePicker: false,
  services: [],
  doctors: [],
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
  servicesModal: {
    open: false,
    statistic: null,
  },
  statistics: [],
};

const doctorAnalyticsSlice = createSlice({
  name: 'doctorAnalytics',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
    },
    setSelectedService(state, action) {
      state.selectedService = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setServices(state, action) {
      state.services = action.payload;
    },
    setStatistics(state, action) {
      state.statistics = action.payload;
    },
    setShowRangePicker(state, action) {
      state.showRangePicker = action.payload;
    },
    setServicesModal(state, action) {
      if (action.payload.open) {
        state.servicesModal = action.payload;
      } else {
        state.servicesModal = {
          open: false,
          statistic: null,
        };
      }
    },
    setInitialQuery(state, action) {
      const { doctorId, serviceId, fromDate, toDate } = action.payload;
      state.selectedDoctor = { id: parseInt(doctorId) };
      state.selectedService = { id: parseInt(serviceId) };
      state.dateRange = [moment(fromDate).toDate(), moment(toDate).toDate()];
    },
  },
});

export const {
  setIsLoading,
  setSelectedDoctor,
  setSelectedService,
  setDateRange,
  setDoctors,
  setServices,
  setStatistics,
  setShowRangePicker,
  setInitialQuery,
  setServicesModal,
} = doctorAnalyticsSlice.actions;

export default doctorAnalyticsSlice.reducer;
