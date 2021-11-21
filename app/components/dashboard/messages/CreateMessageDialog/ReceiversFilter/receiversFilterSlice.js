import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

import { ScheduleStatuses } from '../../../../../utils/constants';

export const initialState = {
  categories: [],
  services: [],
  dateRange: [],
  showRangePicker: false,
  selectedStatuses: [{ id: 'All' }],
  selectedCategories: [{ id: -1 }],
  selectedServices: [{ id: -1 }],
};

const receiversFilterSlice = createSlice({
  name: 'receiversFilter',
  initialState,
  reducers: {
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

    setSelectedCategories(state, action) {
      state.selectedCategories = action.payload;
    },
    addSelectedCategory(state, action) {
      state.selectedCategories = [...state.selectedCategories, action.payload];
    },
    removeSelectedCategory(state, action) {
      state.selectedCategories = state.selectedCategories.filter(
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

    setResponseData(state, action) {
      const { categories, services } = action.payload;
      state.categories = categories;
      state.services = services;
    },
    setShowRangePicker(state, action) {
      state.showRangePicker = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },

    setFilterData(state, action) {
      const {
        statuses: initialStatuses,
        categories: initialCategories,
        services: initialServices,
        startDate,
        endDate,
        clinicData,
      } = action.payload;

      if (initialStatuses.length > 0) {
        state.selectedStatuses = ScheduleStatuses.filter((it) =>
          initialStatuses.includes(it.id),
        );
      }

      if (initialCategories.length > 0) {
        state.selectedCategories = clinicData.categories.filter((it) =>
          initialCategories.includes(it.id),
        );
      }

      if (initialServices.length > 0) {
        state.selectedServices = clinicData.services.filter((it) =>
          initialServices.includes(it.id),
        );
      }

      if (startDate != null && endDate != null) {
        state.dateRange = [
          moment(startDate).toDate(),
          moment(endDate).toDate(),
        ];
      }
    },
  },
});

export const {
  setSelectedStatuses,
  setSelectedCategories,
  setResponseData,
  setSelectedServices,
  setShowRangePicker,
  setDateRange,
  setFilterData,
} = receiversFilterSlice.actions;

export default receiversFilterSlice.reducer;
