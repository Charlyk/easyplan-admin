import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';
import { HYDRATE } from 'next-redux-wrapper';
import { ClinicService, ClinicServiceDetails } from 'types';
import initialState from '../initialState';
import { ServiceDetailsModalState } from '../types';

const servicesListSlice = createSlice({
  name: 'servicesList',
  initialState: initialState.servicesList,
  reducers: {
    fetchServicesList(state) {
      state.isFetching = true;
    },
    fetchServiceDetails(state, _action: PayloadAction<number>) {
      state.isFetchingDetails = true;
    },
    fetchDeletedCategory(state, _action: PayloadAction<number>) {
      state;
    },
    setServicesData(
      state,
      action: PayloadAction<{ services: ClinicService[]; categories: any[] }>,
    ) {
      state.services = sortBy(action.payload.services, (item) =>
        item.name.toLowerCase(),
      );
      state.categories = sortBy(action.payload.categories, (item) =>
        item.name.toLowerCase(),
      );
      state.isFetching = false;
      state.error = null;
    },
    setServiceDetails(
      state,
      action: PayloadAction<ClinicServiceDetails | null>,
    ) {
      state.details = action.payload;
      state.isFetchingDetails = false;
      state.error = null;
    },
    setCategories(state, action: PayloadAction<any[]>) {
      state.categories = action.payload;
      state.isFetching = false;
    },
    addCategory(state, action: PayloadAction<any>) {
      state.categories.push(action.payload);
    },
    deleteCategory(state, action: PayloadAction<any>) {
      const categoryToDelete = action.payload;
      state.categories = state.categories.filter(
        (category) => category.id !== categoryToDelete.id,
      );
    },
    setServices(state, action: PayloadAction<ClinicService[]>) {
      state.services = action.payload;
      state.isFetching = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isFetching = false;
      state.isFetchingDetails = false;
    },
    openDetailsModal(state, action: PayloadAction<ServiceDetailsModalState>) {
      state.detailsModal = action.payload;
    },
    closeDetailsModal(state) {
      state.detailsModal = initialState.servicesList.detailsModal;
      state.details = null;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.servicesList,
      };
    },
  },
});

export const {
  fetchServicesList,
  fetchServiceDetails,
  setError,
  fetchDeletedCategory,
  addCategory,
  setServices,
  deleteCategory,
  setCategories,
  setServicesData,
  setServiceDetails,
  openDetailsModal,
  closeDetailsModal,
} = servicesListSlice.actions;

export default servicesListSlice.reducer;
